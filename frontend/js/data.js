// Mock Enterprise Database for Apex University Campus Cloud
const CampusDB = {
  university: {
    name: "Apex University of Science & Technology",
    shortName: "AUST Islamabad",
    tagline: "Empowering Minds, Innovating Futures",
    campus: "Executive Campus - Sector H-12, Islamabad",
    currentSemester: "Fall 2026",
    session: "2024 - 2028",
    hecRank: "Rank #3 in Engineering & Tech",
    registrarPhone: "+92 51 9085 2000",
    supportEmail: "registrar@aust.edu.pk"
  },

  stats: {
    totalStudents: 4820,
    activeFaculty: 245,
    departments: 8,
    activeCourses: 132,
    feeCollectionRate: "92.4%",
    avgAttendance: "86.8%",
    libraryResources: 64000,
    researchPapers: 312
  },

  departments: [
    { code: "CS", name: "Computer Science", hod: "Dr. Tariq Mehmood", faculty: 42, students: 1420, labs: 8, budget: "PKR 45M" },
    { code: "SE", name: "Software Engineering", hod: "Dr. Kamran Ali", faculty: 36, students: 1150, labs: 6, budget: "PKR 38M" },
    { code: "AI", name: "Artificial Intelligence & Data Science", hod: "Dr. Asma Rauf", faculty: 28, students: 680, labs: 4, budget: "PKR 29M" },
    { code: "BBA", name: "Business Administration & Management", hod: "Prof. Sohail Qureshi", faculty: 35, students: 890, labs: 3, budget: "PKR 30M" },
    { code: "EE", name: "Electrical & Computer Engineering", hod: "Dr. Rehan Siddiqui", faculty: 32, students: 420, labs: 7, budget: "PKR 40M" },
    { code: "CYS", name: "Cyber Security & Information Assurance", hod: "Dr. Bilal Saeed", faculty: 18, students: 260, labs: 3, budget: "PKR 22M" }
  ],

  students: [
    { id: "STU-101", name: "Muhammad Ali Khan", rollNo: "BCS-FA22-019", dept: "Computer Science", semester: 6, cgpa: 3.78, attendance: 91, feeStatus: "Paid", email: "ali.khan@aust.edu.pk", phone: "+92 301 4567891", city: "Islamabad", status: "Active" },
    { id: "STU-102", name: "Ayesha Fatima", rollNo: "BSE-FA22-045", dept: "Software Engineering", semester: 6, cgpa: 3.92, attendance: 96, feeStatus: "Paid", email: "ayesha.f@aust.edu.pk", phone: "+92 312 9876543", city: "Rawalpindi", status: "Active" },
    { id: "STU-103", name: "Hamza Ahmed", rollNo: "BAI-FA23-012", dept: "Artificial Intelligence", semester: 4, cgpa: 3.45, attendance: 82, feeStatus: "Pending", email: "hamza.a@aust.edu.pk", phone: "+92 333 1122334", city: "Lahore", status: "Warning" },
    { id: "STU-104", name: "Zainab Tariq", rollNo: "BCS-SP23-088", dept: "Computer Science", semester: 5, cgpa: 3.65, attendance: 88, feeStatus: "Paid", email: "zainab.t@aust.edu.pk", phone: "+92 345 5566778", city: "Peshawar", status: "Active" },
    { id: "STU-105", name: "Usman Raza", rollNo: "BBA-FA22-031", dept: "Business Administration", semester: 6, cgpa: 3.20, attendance: 76, feeStatus: "Partial", email: "usman.r@aust.edu.pk", phone: "+92 300 9988776", city: "Multan", status: "Active" },
    { id: "STU-106", name: "Sara Noor", rollNo: "BEE-FA21-009", dept: "Electrical Engineering", semester: 8, cgpa: 3.84, attendance: 94, feeStatus: "Paid", email: "sara.n@aust.edu.pk", phone: "+92 321 4455667", city: "Islamabad", status: "Active" },
    { id: "STU-107", name: "Bilal Sheikh", rollNo: "BCS-FA23-110", dept: "Computer Science", semester: 4, cgpa: 2.95, attendance: 68, feeStatus: "Pending", email: "bilal.s@aust.edu.pk", phone: "+92 315 2233445", city: "Faisalabad", status: "Critical" },
    { id: "STU-108", name: "Mahnoor Jahangir", rollNo: "BCS-FA22-054", dept: "Computer Science", semester: 6, cgpa: 3.71, attendance: 89, feeStatus: "Paid", email: "mahnoor.j@aust.edu.pk", phone: "+92 304 3322119", city: "Islamabad", status: "Active" }
  ],

  faculty: [
    { id: "FAC-201", name: "Dr. Tariq Mehmood", dept: "Computer Science", designation: "Professor & HoD", qualification: "Ph.D. Computer Vision (Stanford)", email: "tariq.m@aust.edu.pk", courses: ["Design & Analysis of Algorithms", "Advanced AI"], phone: "+92 300 1234567", cabin: "Faculty Block B - Room 304" },
    { id: "FAC-202", name: "Engr. Fatima Zahra", dept: "Software Engineering", designation: "Assistant Professor", qualification: "MS Software Eng (NUST)", email: "f.zahra@aust.edu.pk", courses: ["Software Architecture", "Web Technologies"], phone: "+92 333 7654321", cabin: "Faculty Block A - Room 112" },
    { id: "FAC-203", name: "Dr. Naveed Akhtar", dept: "Computer Science", designation: "Associate Professor", qualification: "Ph.D. Distributed Systems (TU Munich)", email: "n.akhtar@aust.edu.pk", courses: ["Database Systems", "Cloud Computing"], phone: "+92 312 3456789", cabin: "Faculty Block B - Room 209" },
    { id: "FAC-204", name: "Ms. Sadia Munir", dept: "Business Administration", designation: "Senior Lecturer", qualification: "MBA Finance (LUMS)", email: "s.munir@aust.edu.pk", courses: ["Principles of Management", "Marketing Strategy"], phone: "+92 345 8899001", cabin: "Faculty Block C - Room 105" }
  ],

  courses: [
    { code: "CS-311", title: "Design & Analysis of Algorithms", credits: 3, teacher: "Dr. Tariq Mehmood", room: "Lab-402", timing: "Mon & Wed 09:00 - 10:30 AM", attendance: 92, grade: "A", marks: { quiz: 14, assign: 14, mid: 27, final: 36, total: 91 } },
    { code: "CS-315", title: "Database Systems & Design", credits: 4, teacher: "Dr. Naveed Akhtar", room: "Lab-201", timing: "Tue & Thu 11:00 - 01:00 PM", attendance: 88, grade: "A-", marks: { quiz: 13, assign: 13, mid: 25, final: 34, total: 85 } },
    { code: "SE-322", title: "Web Application Engineering", credits: 3, teacher: "Engr. Fatima Zahra", room: "CS-Hall B", timing: "Mon & Wed 01:30 - 03:00 PM", attendance: 95, grade: "A+", marks: { quiz: 15, assign: 15, mid: 29, final: 38, total: 97 } },
    { code: "CS-319", title: "Operating Systems Principles", credits: 3, teacher: "Dr. Salman Qureshi", room: "Room-105", timing: "Fri 09:00 - 12:00 PM", attendance: 85, grade: "B+", marks: { quiz: 12, assign: 12, mid: 23, final: 32, total: 79 } },
    { code: "HU-204", title: "Technical & Professional Communication", credits: 2, teacher: "Ms. Amina Bilal", room: "Auditorium-1", timing: "Thursday 02:00 - 04:00 PM", attendance: 90, grade: "A", marks: { quiz: 14, assign: 13, mid: 26, final: 35, total: 88 } }
  ],

  // Faculty Gradebook data for CS-311
  gradebook: [
    { rollNo: "BCS-FA22-019", name: "Muhammad Ali Khan", quiz: 14, assign: 14, mid: 27, final: 36, total: 91, grade: "A" },
    { rollNo: "BCS-FA22-045", name: "Ayesha Fatima", quiz: 15, assign: 15, mid: 29, final: 38, total: 97, grade: "A+" },
    { rollNo: "BCS-FA23-012", name: "Hamza Ahmed", quiz: 11, assign: 12, mid: 22, final: 29, total: 74, grade: "B" },
    { rollNo: "BCS-SP23-088", name: "Zainab Tariq", quiz: 13, assign: 14, mid: 26, final: 33, total: 86, grade: "A-" },
    { rollNo: "BCS-FA23-110", name: "Bilal Sheikh", quiz: 8, assign: 9, mid: 16, final: 23, total: 56, grade: "C" }
  ],

  notices: [
    { id: 1, title: "Mid-Term Examination Schedule - Fall 2026", date: "Nov 14, 2026", category: "Examinations", author: "Office of the Controller of Exams", priority: "High", content: "All regular and repeat students are notified that Mid-Term Examinations will officially commence from 25th November 2026. Hall tickets and admit cards are now unlocked for download in the portal." },
    { id: 2, title: "Semester Fee Clearance & Voucher Submission Deadline", date: "Nov 12, 2026", category: "Finance", author: "Director Finance & Accounts", priority: "Urgent", content: "Students with pending dues must clear their challans before 20th November to avoid examination hall debarment and late surcharge penalties." },
    { id: 3, title: "Annual Apex National Hackathon & AI Showcase 2026", date: "Nov 08, 2026", category: "Events", author: "ORIC & IEEE Student Chapter", priority: "Normal", content: "Registration is open for the 48-hour National Hackathon. Industry leaders from Systems Ltd, Arbisoft, and 10Pearls will be hiring directly from the competition." },
    { id: 4, title: "Winter Internship Drive - Leading Tech Houses", date: "Nov 05, 2026", category: "Careers", author: "Career & Placement Bureau", priority: "Normal", content: "On-campus interviews and coding assessments are scheduled next week in Lab 401-403 for final-year students." }
  ],

  timetable: [
    { day: "Monday", slots: [
      { time: "09:00 - 10:30 AM", course: "Design & Analysis of Algorithms", code: "CS-311", teacher: "Dr. Tariq Mehmood", room: "Lab-402", type: "Lecture" },
      { time: "11:00 - 12:30 PM", course: "Operating Systems Principles", code: "CS-319", teacher: "Dr. Salman Qureshi", room: "Room-105", type: "Lecture" },
      { time: "01:30 - 03:00 PM", course: "Web Application Engineering", code: "SE-322", teacher: "Engr. Fatima Zahra", room: "CS-Hall B", type: "Lecture" }
    ]},
    { day: "Tuesday", slots: [
      { time: "11:00 - 01:00 PM", course: "Database Systems & Design (Lab)", code: "CS-315", teacher: "Dr. Naveed Akhtar", room: "Lab-201", type: "Hands-on Lab" },
      { time: "02:00 - 03:30 PM", course: "Technical & Report Writing", code: "HU-204", teacher: "Ms. Amina Bilal", room: "Auditorium-1", type: "Lecture" }
    ]},
    { day: "Wednesday", slots: [
      { time: "09:00 - 10:30 AM", course: "Design & Analysis of Algorithms", code: "CS-311", teacher: "Dr. Tariq Mehmood", room: "Lab-402", type: "Lecture" },
      { time: "01:30 - 03:00 PM", course: "Web Application Engineering (Lab)", code: "SE-322", teacher: "Engr. Fatima Zahra", room: "CS-Hall B", type: "Hands-on Lab" }
    ]},
    { day: "Thursday", slots: [
      { time: "11:00 - 01:00 PM", course: "Database Systems Theory", code: "CS-315", teacher: "Dr. Naveed Akhtar", room: "Room-204", type: "Lecture" },
      { time: "02:00 - 04:00 PM", course: "Software Quality Assurance", code: "SE-412", teacher: "Dr. Imran Malik", room: "Lab-303", type: "Lecture" }
    ]},
    { day: "Friday", slots: [
      { time: "09:00 - 11:30 AM", course: "Operating Systems Principles (Lab)", code: "CS-319", teacher: "Dr. Salman Qureshi", room: "Lab-102", type: "Hands-on Lab" }
    ]}
  ],

  feeChallan: {
    challanNo: "AUST-2026-90412",
    dueDate: "20 Nov 2026",
    studentName: "Muhammad Ali Khan",
    rollNo: "BCS-FA22-019",
    semester: "6th (Fall 2026)",
    department: "Computer Science",
    items: [
      { desc: "Tuition Fee (15 Credit Hours @ PKR 4,500)", amount: 67500 },
      { desc: "Computer Laboratory, Cloud & Software Infrastructure", amount: 8000 },
      { desc: "Digital Library, IEEE Journals & Research Access", amount: 2500 },
      { desc: "Student Campus Development & Sports Fund", amount: 2000 },
      { desc: "Examination & Degree Assessment Fund", amount: 3500 }
    ],
    totalAmount: 83500,
    status: "PAID",
    paidOn: "05 Nov 2026",
    transactionId: "TXN-HBL-992104-PK",
    bankDetails: "Habib Bank Limited (HBL) - A/C 0921-7901234503 (AUST Collection Account)"
  },

  admitCard: {
    rollNo: "BCS-FA22-019",
    name: "Muhammad Ali Khan",
    program: "Bachelor of Science in Computer Science (BSCS)",
    semester: "6th Semester",
    center: "Main Campus Academic Block B - Exam Hall 2",
    exams: [
      { date: "25 Nov 2026", time: "09:00 - 11:00 AM", code: "CS-311", title: "Design & Analysis of Algorithms", seat: "B2-19" },
      { date: "27 Nov 2026", time: "09:00 - 11:00 AM", code: "CS-315", title: "Database Systems & Design", seat: "B2-19" },
      { date: "30 Nov 2026", time: "01:30 - 03:30 PM", code: "SE-322", title: "Web Application Engineering", seat: "B2-19" },
      { date: "02 Dec 2026", time: "09:00 - 11:00 AM", code: "CS-319", title: "Operating Systems Principles", seat: "B2-19" },
      { date: "04 Dec 2026", time: "02:00 - 04:00 PM", code: "HU-204", title: "Technical Communication", seat: "B2-19" }
    ]
  }
};
