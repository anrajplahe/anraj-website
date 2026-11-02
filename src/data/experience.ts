export type Experience = {
  id: string;
  organisation: string;
  title: string;
  dates: string;
  description: string;
  responsibilities: string[];
  achievements: string[];
};

// Verified against the CV supplied by Anraj on 2 November 2026; most recent first.
// Source: https://docs.google.com/document/d/1PYS7Wb0dwzAah9_vWYAHHYlmMdmZWYwck00bgDABb-I/edit
export const experiences: Experience[] = [
  {
    id: "bishop-challoner",
    organisation: "Bishop Challoner Catholic College",
    title: "IT Technician & Reprographics Officer",
    dates: "Sep 2026 – Present",
    description: "First-line IT support, Windows device deployment and technical troubleshooting for staff and students.",
    responsibilities: [
      "Diagnose hardware, software, account and connectivity issues, explaining solutions to users with different levels of technical knowledge.",
      "Support Microsoft 365, Active Directory, Microsoft Entra ID and Microsoft Intune, including user accounts, device management and access issues.",
      "Repair and test hardware, coordinate warranty repairs and replacement parts with suppliers, and maintain IT asset records.",
    ],
    achievements: [
      "Use PowerShell scripts to automate setup and configuration for a fleet of over 600 Windows netbooks, supporting consistent and efficient deployment.",
    ],
  },
  {
    id: "ashfurlong-pharmacy",
    organisation: "Ashfurlong Pharmacy (Enimed Group)",
    title: "Dispenser & Counter Assistant",
    dates: "Sep 2025 – Present",
    description: "Prescription dispensing, stock coordination and support for colleagues using pharmacy computer systems.",
    responsibilities: [
      "Dispense prescriptions and handle sensitive patient information following strict procedures for accuracy and confidentiality.",
      "Coordinate stock records and supplier communication across multiple branches.",
      "Help colleagues learn new computer systems and adapt to changes in working processes.",
    ],
    achievements: [],
  },
  {
    id: "streetly-academy",
    organisation: "The Streetly Academy",
    title: "Teaching Assistant",
    dates: "Mar 2025 – Apr 2025",
    description: "Programming and problem-solving support for GCSE Computer Science students.",
    responsibilities: [
      "Adapt explanations of programming and problem-solving concepts to different learning needs.",
    ],
    achievements: [
      "Delivered a revision session covering key technical concepts.",
    ],
  },
  {
    id: "lodge-pharmacy",
    organisation: "Lodge Pharmacy",
    title: "Dispenser & Counter Assistant – Digital Process Responsibilities",
    dates: "Jun 2021 – Aug 2024",
    description: "Pharmacy operations, digital process improvements and colleague training in a busy customer-facing environment.",
    responsibilities: [
      "Manage prescriptions, stock systems and customer enquiries.",
    ],
    achievements: [
      "Redesigned invoice and ordering templates to reduce input errors and improve administrative efficiency.",
      "Trained four new colleagues on computer systems and working procedures.",
    ],
  },
  {
    id: "rolls-royce",
    organisation: "Rolls-Royce",
    title: "Operations Test Assurance (Work Experience)",
    dates: "Aug 2018",
    description: "Work experience supporting the testing of aircraft engine control systems.",
    responsibilities: [
      "Support testing and fault identification while learning about quality assurance and strict safety procedures.",
    ],
    achievements: [
      "Presented findings to management staff and engineers, communicating technical issues and outcomes.",
    ],
  },
];
