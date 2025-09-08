// app/context/JobsContext.js
import React, { createContext, useState, useContext } from "react";

// Enhanced mock job data with type, workMode, and level
const mockJobs = [
  {
    id: 1,
    title: "Software Engineering Intern",
    company: "Tech Corp",
    location: "San Francisco",
    salary: "$50/hr",
    image: "https://picsum.photos/id/1/300/200", // Fixed: removed extra spaces
    description:
      "Work on real-world engineering projects using modern tech stacks.",
    category: "internships",
    type: "Internship",
    workMode: "On-site",
    level: "Beginner",
  },
  {
    id: 2,
    title: "UX Design Volunteer",
    company: "Nonprofit Org",
    location: "Remote",
    salary: "Unpaid (Certificate provided)",
    image: "https://picsum.photos/id/2/300/200", // Fixed
    description:
      "Help design apps for social good. No prior experience required.",
    category: "volunteer",
    type: "Volunteer",
    workMode: "Remote",
    level: "All Levels",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Startup Inc",
    location: "New York",
    salary: "$120k/year",
    image: "https://picsum.photos/id/3/300/200", // Fixed
    description:
      "Join our fast-growing team building scalable web applications.",
    category: "internships",
    type: "Full Time",
    workMode: "Hybrid",
    level: "Intermediate",
  },
  {
    id: 4,
    title: "Global Scholarship Program",
    company: "Edu Foundation",
    location: "Worldwide",
    salary: "Full tuition + stipend",
    image: "https://picsum.photos/id/4/300/200", // Fixed
    description: "Apply for funding to study abroad and kickstart your career.",
    category: "scholarships",
    type: "Scholarship",
    workMode: "Remote Learning",
    level: "All Levels",
  },
  {
    id: 5,
    title: "Marketing Intern",
    company: "Growth Studio",
    location: "Austin, TX",
    salary: "$18/hr",
    image: "https://picsum.photos/id/5/300/200",
    description: "Assist in social media campaigns and brand strategy.",
    category: "internships",
    type: "Part Time",
    workMode: "Hybrid",
    level: "Beginner",
  },
  {
    id: 6,
    title: "Open Source Contributor",
    company: "Dev Community",
    location: "Remote",
    salary: "Volunteer (Contribution-based)",
    image: "https://picsum.photos/id/6/300/200",
    description: "Collaborate on open-source tools used by thousands.",
    category: "volunteer",
    type: "Volunteer",
    workMode: "Remote",
    level: "Intermediate",
  },
];

// Create the context
export const JobsContext = createContext();

// Provider component
export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState(mockJobs);

  return (
    <JobsContext.Provider value={{ jobs, setJobs }}>
      {children}
    </JobsContext.Provider>
  );
};

// ✅ Custom Hook
export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
};
