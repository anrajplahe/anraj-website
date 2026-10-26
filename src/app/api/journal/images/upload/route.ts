import { issueSignedToken } from "@vercel/blob";
import { reportImageFailure } from "@/lib/journal/image-diagnostics";
import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { journalImageUploads, posts } from "@/db/schema";
import { requireJournalAdmin } from "@/lib/journal/admin";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, UUID_PATTERN } from "@/lib/journal/images";

export async function POST(request: Request) {
  let operation = "upload.authorise";
  try {
    await requireJournalAdmin();
    operation = "upload.validate-request";
    if (request.headers.get("origin") !== new URL(request.url).origin) throw new Error("Invalid origin.");
    const body = await request.json() as HandleUploadPresignedBody;
    // No callbacks are requested or accepted. Finalisation is authenticated
    // separately and works on localhost. Files <=10 MiB use single PUT uploads.
    if (body?.type !== "blob.generate-presigned-url" || !body.payload || body.payload.multipart) {
      throw new Error("Invalid upload request.");
    }
    operation = "upload.presigned-handler";
    const result = await handleUploadPresigned({
      request,
      body,
      getSignedToken: async (pathname, clientPayload) => {
        operation = "upload.validate-reference";
        const payload = JSON.parse(clientPayload ?? "null");
        if (!payload || typeof payload.id !== "string" || !UUID_PATTERN.test(payload.id) ||
          typeof payload.postId !== "string" || !UUID_PATTERN.test(payload.postId)) throw new Error("Invalid upload.");
        operation = "upload.load-upload-record";
        const [upload] = await db.select({ upload: journalImageUploads }).from(journalImageUploads)
          .innerJoin(posts, eq(posts.id, journalImageUploads.postId))
          .where(and(eq(journalImageUploads.id, payload.id), eq(posts.id, payload.postId))).limit(1);
        if (!upload || upload.upload.pathname !== pathname || upload.upload.verifiedAt ||
          Date.now() - upload.upload.createdAt.getTime() > 15 * 60 * 1000 ||
          !IMAGE_TYPES.some((type) => type === upload.upload.contentType)) throw new Error("Upload expired or invalid.");
        const constraints = {
          pathname,
          operations: ["put"] as ["put"],
          allowedContentTypes: [upload.upload.contentType],
          maximumSizeInBytes: Math.min(upload.upload.size, MAX_IMAGE_BYTES),
          validUntil: Date.now() + 5 * 60 * 1000,
        };
        operation = "upload.issue-signed-token";
        // SDK 2.8.2 resolves OIDC + store ID or a legacy read/write token.
        // The signing material stays here; only a scoped upload payload is returned.
        const token = await issueSignedToken(constraints);
        operation = "upload.sign-url";
        return { token, urlOptions: {
          allowedContentTypes: constraints.allowedContentTypes,
          maximumSizeInBytes: constraints.maximumSizeInBytes,
          validUntil: constraints.validUntil,
          addRandomSuffix: false,
          allowOverwrite: false,
        } };
      },
    });
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (cause) {
    const diagnostic = reportImageFailure(operation, cause);
    return Response.json(diagnostic, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
}
