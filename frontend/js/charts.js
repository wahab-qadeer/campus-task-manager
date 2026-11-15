// Chart Configurations for University Campus Management System

let adminEnrollmentChart = null;
let adminFeeChart = null;
let studentAttendanceChart = null;
let studentGpaChart = null;

function initAdminCharts() {
  // 1. Enrollment by Department
  const ctxEnroll = document.getElementById('enrollmentChart');
  if (ctxEnroll) {
    if (adminEnrollmentChart) adminEnrollmentChart.destroy();
    adminEnrollmentChart = new Chart(ctxEnroll, {
      type: 'bar',
      data: {
        labels: ['Computer Science', 'Software Eng', 'AI & Data Sci', 'Business Admin', 'Electrical Eng', 'Cyber Security'],
        datasets: [{
          label: 'Enrolled Students',
          data: [1420, 1150, 680, 890, 420, 260],
          backgroundColor: [
            '#2563eb', '#3b82f6', '#60a5fa', '#10b981', '#f59e0b', '#8b5cf6'
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.4)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 2. Fee Collection Breakdown
  const ctxFee = document.getElementById('feeChart');
  if (ctxFee) {
    if (adminFeeChart) adminFeeChart.destroy();
    adminFeeChart = new Chart(ctxFee, {
      type: 'doughnut',
      data: {
        labels: ['Full Paid (92.4%)', 'Pending (5.2%)', 'Partial Defaulter (2.4%)'],
        datasets: [{
          data: [4450, 250, 120],
          backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        cutout: '70%'
      }
    });
  }
}

function initStudentCharts() {
  // 1. Student Attendance by Subject
  const ctxAtt = document.getElementById('studentAttendanceChart');
  if (ctxAtt) {
    if (studentAttendanceChart) studentAttendanceChart.destroy();
    studentAttendanceChart = new Chart(ctxAtt, {
      type: 'radar',
      data: {
        labels: ['Algorithms', 'Database', 'Web Eng', 'Operating Sys', 'Report Writing'],
        datasets: [{
          label: 'Attendance %',
          data: [92, 88, 95, 85, 90],
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: '#2563eb',
          pointBackgroundColor: '#2563eb'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            suggestedMin: 50,
            suggestedMax: 100,
            ticks: { stepSize: 10 }
          }
        }
      }
    });
  }

  // 2. Semester GPA Trajectory
  const ctxGpa = document.getElementById('studentGpaChart');
  if (ctxGpa) {
    if (studentGpaChart) studentGpaChart.destroy();
    studentGpaChart = new Chart(ctxGpa, {
      type: 'line',
      data: {
        labels: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6 (Current)'],
        datasets: [{
          label: 'GPA',
          data: [3.62, 3.70, 3.65, 3.82, 3.75, 3.78],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 2.0, max: 4.0 }
        }
      }
    });
  }
}
