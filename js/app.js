// Apex University Enterprise Campus Management System Logic

let currentRole = 'admin'; // 'admin', 'faculty', 'student'
let currentTab = 'admin-dashboard';
let attendanceState = {}; // Key: studentId, Value: 'present' | 'absent' | 'late'

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupRoleSwitcher();
  setupSearchAndFilters();
  setupModals();
  setupDarkMode();
  switchRole('admin'); // Default starting role
});

// Switch User Role
function switchRole(role) {
  currentRole = role;
  
  const roleBadges = document.querySelectorAll('.role-indicator');
  const roleAvatars = document.querySelectorAll('.user-role-label');
  const roleUserNames = document.querySelectorAll('.user-name-label');

  let title = 'System Administrator';
  let name = 'Admin Office (Superuser)';
  let defaultTab = 'admin-dashboard';

  if (role === 'faculty') {
    title = 'Professor & HoD (CS)';
    name = 'Dr. Tariq Mehmood';
    defaultTab = 'faculty-dashboard';
  } else if (role === 'student') {
    title = 'Undergraduate (BSCS 6th)';
    name = 'Muhammad Ali Khan';
    defaultTab = 'student-dashboard';
  }

  roleBadges.forEach(b => b.textContent = role.toUpperCase());
  roleAvatars.forEach(a => a.textContent = title);
  roleUserNames.forEach(n => n.textContent = name);

  // Toggle active class on role switcher buttons
  document.querySelectorAll('[data-role-switch]').forEach(btn => {
    if (btn.getAttribute('data-role-switch') === role) {
      btn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/40 transition flex items-center space-x-1.5';
    } else {
      btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition flex items-center space-x-1.5';
    }
  });

  // Show/Hide Sidebar Navigation Sections
  document.getElementById('nav-admin-group').style.display = (role === 'admin') ? 'block' : 'none';
  document.getElementById('nav-faculty-group').style.display = (role === 'faculty') ? 'block' : 'none';
  document.getElementById('nav-student-group').style.display = (role === 'student') ? 'block' : 'none';

  switchTab(defaultTab);
  showToast(`Switched to ${role.toUpperCase()} View`);
}

// Switch Active View Tab
function switchTab(tabId) {
  currentTab = tabId;

  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.add('hidden');
  });

  const target = document.getElementById(tabId);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('animate-fade-in');
  }

  // Update sidebar active highlights
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-tab') === tabId) {
      link.classList.add('bg-blue-50', 'text-blue-600', 'font-bold', 'dark:bg-slate-800', 'dark:text-blue-400');
      link.classList.remove('text-slate-600', 'hover:bg-slate-50', 'dark:text-slate-300');
    } else {
      link.classList.remove('bg-blue-50', 'text-blue-600', 'font-bold', 'dark:bg-slate-800', 'dark:text-blue-400');
      link.classList.add('text-slate-600', 'hover:bg-slate-50', 'dark:text-slate-300');
    }
  });

  // Render dynamic content for the tab
  renderTabData(tabId);
  closeMobileSidebar();
}

function setupNavigation() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.getAttribute('data-tab');
      if (tab) switchTab(tab);
    });
  });
}

function setupRoleSwitcher() {
  document.querySelectorAll('[data-role-switch]').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-role-switch');
      switchRole(role);
    });
  });
}

// Render data based on current active tab
function renderTabData(tabId) {
  if (tabId === 'admin-dashboard') {
    setTimeout(initAdminCharts, 50);
    renderRecentStudentsList();
    renderRecentNoticesMini();
  } else if (tabId === 'admin-students') {
    ApiService.getStudents().then(list => renderStudentsTable(list));
  } else if (tabId === 'admin-faculty') {
    renderFacultyTable(CampusDB.faculty);
  } else if (tabId === 'admin-departments') {
    renderDepartmentsGrid();
  } else if (tabId === 'admin-timetable') {
    renderTimetableGrid();
  } else if (tabId === 'admin-notices' || tabId === 'faculty-notices' || tabId === 'student-notices') {
    ApiService.getNotices().then(list => renderNoticesList(list));
  } else if (tabId === 'faculty-dashboard') {
    renderFacultyOverview();
  } else if (tabId === 'faculty-attendance') {
    initAttendanceMarker();
  } else if (tabId === 'faculty-grades') {
    renderFacultyGradebook();
  } else if (tabId === 'student-dashboard') {
    setTimeout(initStudentCharts, 50);
    renderStudentUpcomingClasses();
  } else if (tabId === 'student-courses') {
    renderStudentCourses();
  } else if (tabId === 'student-attendance') {
    renderStudentAttendanceDetails();
  } else if (tabId === 'student-timetable') {
    renderTimetableGrid('student-timetable-container');
  } else if (tabId === 'student-challan') {
    renderFeeChallan();
  } else if (tabId === 'student-admitcard') {
    renderAdmitCard();
  }
}

// Render Departments Grid
function renderDepartmentsGrid() {
  const container = document.getElementById('departments-grid');
  if (!container) return;
  container.innerHTML = '';

  CampusDB.departments.forEach(dept => {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 card-shadow card-shadow-hover flex flex-col justify-between';
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">${dept.code}</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400"><i class="fa-solid fa-flask text-indigo-500 mr-1"></i>${dept.labs} High-Tech Labs</span>
        </div>
        <h4 class="font-extrabold text-slate-900 dark:text-white text-base mb-1">${dept.name}</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-4"><i class="fa-solid fa-user-tie text-blue-500 mr-1.5"></i>Head of Dept: <strong class="text-slate-700 dark:text-slate-200">${dept.hod}</strong></p>
        
        <div class="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl mb-4 text-xs">
          <div><span class="text-slate-400 block text-[11px]">Enrolled Students</span><strong class="text-slate-900 dark:text-white font-bold text-sm">${dept.students}</strong></div>
          <div><span class="text-slate-400 block text-[11px]">Faculty Members</span><strong class="text-slate-900 dark:text-white font-bold text-sm">${dept.faculty}</strong></div>
        </div>
      </div>
      <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/80 text-xs">
        <span class="text-slate-500">Annual Budget: <strong class="text-emerald-600 font-semibold">${dept.budget}</strong></span>
        <button onclick="showToast('Viewing full syllabus for ${dept.code}')" class="text-blue-600 hover:underline font-semibold">View Detail &rarr;</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Render Students Table (Admin)
function renderStudentsTable(list) {
  const tbody = document.getElementById('students-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const totalEl = document.getElementById('students-count-badge');
  if (totalEl) totalEl.textContent = `${list.length} Students`;

  list.forEach(stu => {
    const feeBadge = stu.feeStatus === 'Paid' 
      ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>Paid</span>'
      : (stu.feeStatus === 'Pending' 
        ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800"><span class="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>Pending</span>'
        : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>Partial</span>');

    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition text-xs';
    tr.innerHTML = `
      <td class="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">${stu.rollNo}</td>
      <td class="py-3.5 px-4">
        <div class="font-bold text-slate-800 dark:text-white text-sm">${stu.name}</div>
        <div class="text-[11px] text-slate-400 font-mono">${stu.email}</div>
      </td>
      <td class="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">${stu.dept}</td>
      <td class="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-200">${stu.semester}th</td>
      <td class="py-3.5 px-4 text-center">
        <span class="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white font-mono">${stu.cgpa.toFixed(2)}</span>
      </td>
      <td class="py-3.5 px-4 text-center">
        <div class="font-bold ${stu.attendance < 75 ? 'text-rose-500' : 'text-emerald-600'}">${stu.attendance}%</div>
        <div class="w-16 mx-auto bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
          <div class="h-full ${stu.attendance < 75 ? 'bg-rose-500' : 'bg-emerald-500'}" style="width: ${stu.attendance}%"></div>
        </div>
      </td>
      <td class="py-3.5 px-4 text-center">${feeBadge}</td>
      <td class="py-3.5 px-4 text-right space-x-1">
        <button onclick="viewStudentProfile('${stu.id}')" class="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition">View</button>
        <button onclick="showToast('Sent academic warning letter to ${stu.name}')" class="px-2.5 py-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-950/50 dark:text-blue-300 transition">Action</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Faculty Table
function renderFacultyTable(list) {
  const tbody = document.getElementById('faculty-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  list.forEach(f => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition text-xs';
    tr.innerHTML = `
      <td class="py-3.5 px-4">
        <div class="font-bold text-slate-900 dark:text-white text-sm">${f.name}</div>
        <div class="text-[11px] text-slate-400">${f.qualification}</div>
      </td>
      <td class="py-3.5 px-4">
        <span class="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">${f.designation}</span>
      </td>
      <td class="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">${f.dept}</td>
      <td class="py-3.5 px-4 text-slate-600 dark:text-slate-400">${f.courses.join(' • ')}</td>
      <td class="py-3.5 px-4 font-mono text-slate-500">${f.email}</td>
      <td class="py-3.5 px-4 text-right">
        <button onclick="showToast('Office Location: ${f.cabin}')" class="px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200">Office Cabin</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Interactive Attendance Marker for Faculty
function initAttendanceMarker() {
  const container = document.getElementById('attendance-marking-list');
  if (!container) return;
  container.innerHTML = '';

  CampusDB.students.forEach(stu => {
    if (!attendanceState[stu.id]) attendanceState[stu.id] = 'present';

    const row = document.createElement('div');
    row.className = 'flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 gap-3 card-shadow';
    row.innerHTML = `
      <div class="flex items-center space-x-3.5">
        <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm shadow-sm">
          ${stu.name.charAt(0)}
        </div>
        <div>
          <div class="text-sm font-bold text-slate-900 dark:text-white">${stu.name}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 font-mono">${stu.rollNo} • Current Attendance: <strong class="${stu.attendance < 75 ? 'text-rose-500' : 'text-emerald-600'}">${stu.attendance}%</strong></div>
        </div>
      </div>
      <div class="flex items-center space-x-2" id="att-buttons-${stu.id}">
        <button onclick="setStudentAttendance('${stu.id}', 'present')" class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${attendanceState[stu.id] === 'present' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50'}">
          <i class="fa-solid fa-check mr-1"></i> Present
        </button>
        <button onclick="setStudentAttendance('${stu.id}', 'absent')" class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${attendanceState[stu.id] === 'absent' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50'}">
          <i class="fa-solid fa-xmark mr-1"></i> Absent
        </button>
        <button onclick="setStudentAttendance('${stu.id}', 'late')" class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${attendanceState[stu.id] === 'late' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-amber-50'}">
          <i class="fa-solid fa-clock mr-1"></i> Late
        </button>
      </div>
    `;
    container.appendChild(row);
  });
}

function setStudentAttendance(stuId, status) {
  attendanceState[stuId] = status;
  initAttendanceMarker();
}

function saveFacultyAttendance() {
  showToast('Attendance recorded and synced to Academic ERP Portal successfully!', 'success');
}

// Faculty Gradebook Marks Entry
function renderFacultyGradebook() {
  const tbody = document.getElementById('faculty-gradebook-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  CampusDB.gradebook.forEach((gb, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-100 dark:border-slate-800 text-xs';
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-blue-600">${gb.rollNo}</td>
      <td class="py-3 px-4 font-semibold text-slate-800 dark:text-white">${gb.name}</td>
      <td class="py-3 px-3 text-center">
        <input type="number" min="0" max="15" value="${gb.quiz}" onchange="recalculateGrade(${idx}, this.value, 'quiz')" class="w-14 text-center py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono">
      </td>
      <td class="py-3 px-3 text-center">
        <input type="number" min="0" max="15" value="${gb.assign}" onchange="recalculateGrade(${idx}, this.value, 'assign')" class="w-14 text-center py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono">
      </td>
      <td class="py-3 px-3 text-center">
        <input type="number" min="0" max="30" value="${gb.mid}" onchange="recalculateGrade(${idx}, this.value, 'mid')" class="w-14 text-center py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono">
      </td>
      <td class="py-3 px-3 text-center">
        <input type="number" min="0" max="40" value="${gb.final}" onchange="recalculateGrade(${idx}, this.value, 'final')" class="w-14 text-center py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono">
      </td>
      <td class="py-3 px-3 text-center font-bold text-slate-900 dark:text-white font-mono" id="gb-total-${idx}">${gb.total} / 100</td>
      <td class="py-3 px-3 text-center">
        <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300" id="gb-grade-${idx}">${gb.grade}</span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function recalculateGrade(idx, val, field) {
  CampusDB.gradebook[idx][field] = parseFloat(val) || 0;
  const item = CampusDB.gradebook[idx];
  item.total = item.quiz + item.assign + item.mid + item.final;

  if (item.total >= 90) item.grade = 'A+';
  else if (item.total >= 85) item.grade = 'A';
  else if (item.total >= 80) item.grade = 'A-';
  else if (item.total >= 75) item.grade = 'B+';
  else if (item.total >= 70) item.grade = 'B';
  else if (item.total >= 60) item.grade = 'C';
  else if (item.total >= 50) item.grade = 'D';
  else item.grade = 'F';

  document.getElementById(`gb-total-${idx}`).textContent = `${item.total} / 100`;
  document.getElementById(`gb-grade-${idx}`).textContent = item.grade;
  showToast(`Updated marks for ${item.name}`, 'info');
}

// Timetable Renderer
function renderTimetableGrid(containerId = 'admin-timetable-container') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  CampusDB.timetable.forEach(t => {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 card-shadow';
    
    let slotsHtml = t.slots.map(s => `
      <div class="p-3 mb-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border-l-4 border-blue-500 text-xs">
        <div class="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
          <span class="text-sm">${s.course}</span>
          <span class="text-blue-600 dark:text-blue-400 font-mono font-semibold">${s.time}</span>
        </div>
        <div class="text-slate-500 dark:text-slate-400 flex justify-between items-center mt-1 text-[11px]">
          <span><i class="fa-solid fa-chalkboard-user mr-1 text-slate-400"></i>${s.teacher}</span>
          <span class="font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">${s.room}</span>
        </div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-700">
        <h4 class="font-black text-base text-slate-900 dark:text-white">${t.day}</h4>
        <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-mono font-bold">${t.slots.length} Lectures</span>
      </div>
      <div>${slotsHtml}</div>
    `;
    container.appendChild(card);
  });
}

// Notices Renderer
function renderNoticesList() {
  const containers = [
    document.getElementById('admin-notices-list'),
    document.getElementById('faculty-notices-list'),
    document.getElementById('student-notices-list')
  ];

  containers.forEach(container => {
    if (!container) return;
    container.innerHTML = '';

    CampusDB.notices.forEach(n => {
      const priorityBadge = n.priority === 'Urgent' 
        ? '<span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">Urgent</span>'
        : (n.priority === 'High' ? '<span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">High</span>' : '<span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Normal</span>');

      const item = document.createElement('div');
      item.className = 'p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 card-shadow card-shadow-hover';
      item.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">${n.category}</span>
            ${priorityBadge}
          </div>
          <span class="text-xs text-slate-400 font-mono"><i class="fa-regular fa-clock mr-1"></i>${n.date}</span>
        </div>
        <h4 class="text-base font-extrabold text-slate-900 dark:text-white mb-2">${n.title}</h4>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">${n.content}</p>
        <div class="text-xs text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/80 pt-3">
          <span>Authority: <strong class="text-slate-700 dark:text-slate-200">${n.author}</strong></span>
          <button onclick="showToast('Circular downloaded / pinned to desktop')" class="text-blue-600 hover:underline font-semibold flex items-center space-x-1">
            <i class="fa-solid fa-download"></i>
            <span>Download Circular (PDF)</span>
          </button>
        </div>
      `;
      container.appendChild(item);
    });
  });
}

// Student Portal Helpers
function renderStudentCourses() {
  const container = document.getElementById('student-courses-grid');
  if (!container) return;
  container.innerHTML = '';

  CampusDB.courses.forEach(c => {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 card-shadow card-shadow-hover flex flex-col justify-between';
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">${c.code}</span>
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400">${c.credits} Credit Hours</span>
        </div>
        <h4 class="font-extrabold text-slate-900 dark:text-white text-base mb-1">${c.title}</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-3"><i class="fa-solid fa-user-tie mr-1.5 text-blue-500"></i>${c.teacher}</p>
        <div class="text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div><i class="fa-regular fa-clock mr-1 text-blue-500"></i> ${c.timing}</div>
          <div><i class="fa-solid fa-location-dot mr-1 text-emerald-500"></i> ${c.room}</div>
        </div>
      </div>
      <div>
        <div class="flex justify-between text-xs font-bold mb-1.5">
          <span class="text-slate-600 dark:text-slate-400">Attendance Ratio</span>
          <span class="${c.attendance < 75 ? 'text-rose-500' : 'text-emerald-600'}">${c.attendance}%</span>
        </div>
        <div class="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-3">
          <div class="h-full ${c.attendance < 75 ? 'bg-rose-500' : 'bg-emerald-500'}" style="width: ${c.attendance}%"></div>
        </div>
        <div class="flex space-x-2">
          <button onclick="showToast('Syllabus & Lecture Slides opened for ${c.code}')" class="flex-1 py-2 text-xs font-bold text-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 transition">Course Slides</button>
          <button onclick="showToast('Current Grade: ${c.grade} (${c.marks.total}/100)')" class="px-3.5 py-2 text-xs font-black rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-mono">Grade: ${c.grade}</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderStudentAttendanceDetails() {
  const tbody = document.getElementById('student-attendance-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  CampusDB.courses.forEach(c => {
    const totalClasses = 32;
    const attended = Math.round((c.attendance / 100) * totalClasses);
    const missed = totalClasses - attended;
    const statusBadge = c.attendance >= 75 
      ? '<span class="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"><i class="fa-solid fa-check mr-1"></i> Eligible for Exam</span>'
      : '<span class="px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Short Attendance</span>';

    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-100 dark:border-slate-800 text-xs';
    tr.innerHTML = `
      <td class="py-3.5 px-4 font-mono font-bold text-blue-600">${c.code}</td>
      <td class="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">${c.title}</td>
      <td class="py-3.5 px-4 text-center font-mono font-semibold">${totalClasses}</td>
      <td class="py-3.5 px-4 text-center font-mono text-emerald-600 font-bold">${attended}</td>
      <td class="py-3.5 px-4 text-center font-mono text-rose-600 font-bold">${missed}</td>
      <td class="py-3.5 px-4 text-center font-bold text-sm font-mono">${c.attendance}%</td>
      <td class="py-3.5 px-4 text-center">${statusBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Student Admit Card / Roll No Slip Renderer
function renderAdmitCard() {
  const container = document.getElementById('admit-card-view');
  if (!container) return;
  const a = CampusDB.admitCard;

  let examsHtml = a.exams.map((ex, idx) => `
    <tr class="border-b border-slate-200 dark:border-slate-700">
      <td class="py-2.5 px-3 font-mono text-xs">${idx + 1}</td>
      <td class="py-2.5 px-3 font-bold text-xs">${ex.date}</td>
      <td class="py-2.5 px-3 text-xs font-mono text-blue-600">${ex.time}</td>
      <td class="py-2.5 px-3 font-mono font-bold text-xs">${ex.code}</td>
      <td class="py-2.5 px-3 text-xs font-medium">${ex.title}</td>
      <td class="py-2.5 px-3 text-center font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800">${ex.seat}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-md">
      <div class="flex justify-between items-start border-b-2 border-slate-300 dark:border-slate-700 pb-4 mb-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">${CampusDB.university.name}</h2>
          <p class="text-xs text-slate-500">Controller of Examinations • Official Mid-Term Admit Slip (Fall 2026)</p>
        </div>
        <div class="text-right">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-300">EXAM ADMIT CARD</span>
          <div class="text-xs font-mono text-slate-500 mt-1">Roll No: <strong>${a.rollNo}</strong></div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 mb-5 text-xs">
        <div><span class="text-slate-400 block">Candidate Name:</span><strong class="text-slate-800 dark:text-white">${a.name}</strong></div>
        <div><span class="text-slate-400 block">Degree Program:</span><strong class="text-slate-800 dark:text-white">${a.program}</strong></div>
        <div><span class="text-slate-400 block">Examination Center:</span><strong class="text-slate-800 dark:text-white">${a.center}</strong></div>
      </div>

      <table class="w-full mb-6">
        <thead>
          <tr class="border-b-2 border-slate-300 dark:border-slate-700 text-left text-xs uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800">
            <th class="py-2 px-3">#</th>
            <th class="py-2 px-3">Date</th>
            <th class="py-2 px-3">Timing</th>
            <th class="py-2 px-3">Course Code</th>
            <th class="py-2 px-3">Paper Title</th>
            <th class="py-2 px-3 text-center">Desk No</th>
          </tr>
        </thead>
        <tbody>${examsHtml}</tbody>
      </table>

      <div class="text-xs text-slate-500 border-t border-slate-200 dark:border-slate-700 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div><strong>Instructions:</strong> Must bring Original CNIC and Student ID card to examination hall.</div>
        <div class="flex space-x-2 no-print">
          <button onclick="window.print()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm text-xs flex items-center space-x-1.5"><i class="fa-solid fa-print mr-1"></i> Print Admit Card</button>
        </div>
      </div>
    </div>
  `;
}

function renderFeeChallan() {
  const container = document.getElementById('fee-challan-view');
  if (!container) return;
  const f = CampusDB.feeChallan;

  let itemsHtml = f.items.map((item, idx) => `
    <tr class="border-b border-slate-100 dark:border-slate-800">
      <td class="py-2.5 px-3 text-slate-500 text-xs font-mono">${idx + 1}</td>
      <td class="py-2.5 px-3 text-slate-800 dark:text-slate-200 text-xs font-semibold">${item.desc}</td>
      <td class="py-2.5 px-3 text-right font-mono text-xs font-bold">PKR ${item.amount.toLocaleString()}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div id="printable-challan" class="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-md">
      <div class="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-5 mb-5">
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">${CampusDB.university.name}</h2>
          <p class="text-xs text-slate-500">${CampusDB.university.campus} • Official Fee Voucher</p>
        </div>
        <div class="text-right">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-black uppercase ${f.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800'}"><i class="fa-solid fa-circle-check mr-1"></i>${f.status}</span>
          <div class="text-xs font-mono text-slate-500 mt-1">Challan: <strong>${f.challanNo}</strong></div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 mb-6 text-xs">
        <div><span class="text-slate-400 block">Student:</span><strong class="text-slate-800 dark:text-white">${f.studentName}</strong></div>
        <div><span class="text-slate-400 block">Roll No:</span><strong class="font-mono text-slate-800 dark:text-white">${f.rollNo}</strong></div>
        <div><span class="text-slate-400 block">Semester:</span><strong class="text-slate-800 dark:text-white">${f.semester}</strong></div>
        <div><span class="text-slate-400 block">Due Date:</span><strong class="text-rose-600">${f.dueDate}</strong></div>
      </div>

      <table class="w-full mb-6">
        <thead>
          <tr class="border-b-2 border-slate-200 dark:border-slate-700 text-left text-xs text-slate-500 uppercase tracking-wider">
            <th class="py-2 px-3">#</th>
            <th class="py-2 px-3">Description</th>
            <th class="py-2 px-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr class="border-t-2 border-slate-300 dark:border-slate-600 font-bold">
            <td colspan="2" class="py-3 px-3 text-right uppercase text-xs text-slate-700 dark:text-slate-200">Total Payable:</td>
            <td class="py-3 px-3 text-right text-lg font-mono font-black text-blue-600 dark:text-blue-400">PKR ${f.totalAmount.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <div class="text-xs text-slate-500 border-t border-slate-200 dark:border-slate-700 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>Designated Bank: <strong>${f.bankDetails}</strong></div>
        <div class="flex space-x-2 no-print">
          <button onclick="window.print()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm text-xs flex items-center space-x-1.5"><i class="fa-solid fa-print mr-1"></i> Print / Download PDF</button>
        </div>
      </div>
    </div>
  `;
}

// Mini components
function renderRecentStudentsList() {
  const container = document.getElementById('recent-students-mini');
  if (!container) return;
  container.innerHTML = '';

  CampusDB.students.slice(0, 4).forEach(s => {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition';
    item.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
          ${s.name.charAt(0)}
        </div>
        <div>
          <div class="text-xs font-bold text-slate-800 dark:text-white">${s.name}</div>
          <div class="text-[11px] text-slate-400 font-mono">${s.rollNo}</div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-xs font-bold text-emerald-600 font-mono">GPA ${s.cgpa.toFixed(2)}</div>
        <div class="text-[10px] text-slate-400">${s.dept.split(' ')[0]}</div>
      </div>
    `;
    container.appendChild(item);
  });
}

function renderRecentNoticesMini() {
  const container = document.getElementById('recent-notices-mini');
  if (!container) return;
  container.innerHTML = '';

  CampusDB.notices.slice(0, 3).forEach(n => {
    const item = document.createElement('div');
    item.className = 'p-3 rounded-xl border-l-4 border-blue-500 bg-slate-50 dark:bg-slate-800/50 text-xs mb-2.5';
    item.innerHTML = `
      <div class="flex justify-between text-[11px] text-slate-400 mb-1">
        <span class="font-bold text-blue-600 dark:text-blue-400">${n.category}</span>
        <span class="font-mono">${n.date}</span>
      </div>
      <div class="font-bold text-slate-800 dark:text-white mb-0.5">${n.title}</div>
      <div class="text-slate-500 line-clamp-1 text-[11px]">${n.content}</div>
    `;
    container.appendChild(item);
  });
}

function renderStudentUpcomingClasses() {
  const container = document.getElementById('student-today-classes');
  if (!container) return;
  container.innerHTML = '';

  CampusDB.timetable[0].slots.forEach(s => {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700';
    div.innerHTML = `
      <div>
        <div class="font-bold text-xs text-slate-800 dark:text-white">${s.course}</div>
        <div class="text-[11px] text-slate-500">${s.teacher} • <span class="font-bold text-blue-600">${s.room}</span></div>
      </div>
      <span class="text-xs font-mono px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold">${s.time}</span>
    `;
    container.appendChild(div);
  });
}

function renderFacultyOverview() {
  // Static + dynamic cards
}

// Search and Filter functionality
function setupSearchAndFilters() {
  const studentSearch = document.getElementById('student-search-input');
  const deptFilter = document.getElementById('student-dept-filter');

  if (studentSearch) {
    studentSearch.addEventListener('input', filterStudents);
  }
  if (deptFilter) {
    deptFilter.addEventListener('change', filterStudents);
  }
}

function filterStudents() {
  const query = (document.getElementById('student-search-input')?.value || '').toLowerCase();
  const dept = document.getElementById('student-dept-filter')?.value || 'All';

  const filtered = CampusDB.students.filter(s => {
    const matchQuery = s.name.toLowerCase().includes(query) || s.rollNo.toLowerCase().includes(query);
    const matchDept = (dept === 'All') || (s.dept === dept);
    return matchQuery && matchDept;
  });

  renderStudentsTable(filtered);
}

// Modals Handler
function setupModals() {
  const addStudentForm = document.getElementById('add-student-form');
  if (addStudentForm) {
    addStudentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newStudent = {
        name: document.getElementById('modal-stu-name').value,
        rollNo: document.getElementById('modal-stu-roll').value,
        dept: document.getElementById('modal-stu-dept').value,
        semester: parseInt(document.getElementById('modal-stu-sem').value),
        cgpa: parseFloat(document.getElementById('modal-stu-cgpa').value || '3.50'),
        attendance: 100,
        feeStatus: 'Pending',
        email: document.getElementById('modal-stu-email').value,
        phone: '+92 300 0000000',
        city: 'Islamabad',
        status: 'Active'
      };

      try {
        const savedStudent = await ApiService.addStudent(newStudent);
        renderStudentsTable(CampusDB.students);
        closeModal('add-student-modal');
        showToast(`Student ${savedStudent.name} registered and saved in database!`, 'success');
        addStudentForm.reset();
      } catch (err) {
        showToast('Error saving student: ' + err.message, 'error');
      }
    });
  }

  const addNoticeForm = document.getElementById('add-notice-form');
  if (addNoticeForm) {
    addNoticeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newNotice = {
        title: document.getElementById('modal-notice-title').value,
        category: document.getElementById('modal-notice-cat').value,
        priority: document.getElementById('modal-notice-pri').value,
        author: 'Executive Administration',
        date: 'Today',
        content: document.getElementById('modal-notice-body').value
      };
      try {
        await ApiService.publishNotice(newNotice);
        renderNoticesList();
        closeModal('add-notice-modal');
        showToast('Circular published and saved to database!', 'success');
        addNoticeForm.reset();
      } catch (err) {
        showToast('Error publishing notice: ' + err.message, 'error');
      }
    });
  }
}

function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('hidden');
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('hidden');
}

function viewStudentProfile(id) {
  const s = CampusDB.students.find(x => x.id === id);
  if (!s) return;
  alert(`Student Profile Record:\n\nName: ${s.name}\nRoll No: ${s.rollNo}\nDepartment: ${s.dept}\nSemester: ${s.semester}th\nCumulative GPA: ${s.cgpa.toFixed(2)}\nAttendance: ${s.attendance}%\nFee Clearance: ${s.feeStatus}\nOfficial Email: ${s.email}\nContact: ${s.phone}`);
}

function exportStudentsCSV() {
  let csv = "RollNo,Name,Department,Semester,CGPA,Attendance,FeeStatus\n";
  CampusDB.students.forEach(s => {
    csv += `"${s.rollNo}","${s.name}","${s.dept}",${s.semester},${s.cgpa},${s.attendance}%,"${s.feeStatus}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'AUST_Students_Export.csv');
  a.click();
  showToast('Students directory exported to CSV file!', 'success');
}

// Toast Alert System
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white';
  toast.className = `${bg} px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center space-x-2.5 transform translate-y-2 opacity-0 transition-all duration-300 pointer-events-auto border border-white/10`;
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-sm"></i><span>${message}</span>`;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Mobile sidebar controls
function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('-translate-x-full');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar && window.innerWidth < 1024) {
    sidebar.classList.add('-translate-x-full');
  }
}

// Dark Mode Toggle
function setupDarkMode() {
  const toggleBtn = document.getElementById('dark-mode-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    toggleBtn.innerHTML = isDark 
      ? '<i class="fa-solid fa-sun text-amber-400"></i>' 
      : '<i class="fa-solid fa-moon text-slate-600"></i>';
    showToast(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`);
  });
}

// ==================== ZERO-CODE API CONNECTION CONTROLS ====================
function initApiManager() {
  const input = document.getElementById('api-url-input');
  if (input) input.value = ApiService.getBaseUrl();

  // Background ping on launch
  ApiService.checkConnection().then(res => {
    updateApiStatusBadge(res.online);
  });
}

function setApiPreset(url) {
  const input = document.getElementById('api-url-input');
  if (input) input.value = url;
}

async function testBackendApiConnection() {
  const input = document.getElementById('api-url-input');
  const indicator = document.getElementById('api-live-indicator');
  if (!input || !indicator) return;

  const testUrl = input.value.trim();
  ApiService.setBaseUrl(testUrl);

  indicator.innerHTML = '<span class="text-blue-500 animate-pulse"><i class="fa-solid fa-spinner fa-spin mr-1"></i> Pinging...</span>';

  const res = await ApiService.checkConnection();
  if (res.online) {
    indicator.innerHTML = '<span class="text-emerald-600 font-bold"><i class="fa-solid fa-circle-check mr-1"></i> Live Connected!</span>';
    updateApiStatusBadge(true);
    showToast('Connected to live backend database!', 'success');
  } else {
    indicator.innerHTML = `<span class="text-amber-500 font-bold"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Offline (${res.error})</span>`;
    updateApiStatusBadge(false);
    showToast('Backend offline. Demo mode is active.', 'info');
  }
}

function saveBackendApiUrl() {
  const input = document.getElementById('api-url-input');
  if (!input) return;
  const url = input.value.trim();
  ApiService.setBaseUrl(url);
  testBackendApiConnection();
  closeModal('api-config-modal');
}

function updateApiStatusBadge(isLive) {
  const badge = document.getElementById('api-status-label');
  if (!badge) return;
  if (isLive) {
    badge.innerHTML = '<span class="text-emerald-600">● Live Backend</span>';
    badge.parentElement.className = 'flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 transition cursor-pointer';
  } else {
    badge.innerHTML = '<span class="text-slate-500">● Demo Mode</span>';
    badge.parentElement.className = 'flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer';
  }
}

// Call on startup
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initApiManager, 500);
});
