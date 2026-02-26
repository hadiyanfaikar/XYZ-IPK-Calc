document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const addCourseBtn = document.getElementById('add-course-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultSection = document.getElementById('result-section');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Custom Alert Elements
    const customAlert = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const alertOkBtn = document.getElementById('alert-ok-btn');

    let courseCounter = 0;

    // Tambah baris awal
    addCourseRow();
    addCourseRow();
    addCourseRow();

    addCourseBtn.addEventListener('click', addCourseRow);
    calculateBtn.addEventListener('click', calculateIPK);
    resetBtn.addEventListener('click', resetAll);

    // Close Alert
    alertOkBtn.addEventListener('click', () => {
        customAlert.classList.add('hidden');
    });

    function showCustomAlert(msg) {
        alertMessage.innerText = msg;
        customAlert.classList.remove('hidden');
    }

    function addCourseRow() {
        courseCounter++;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <input type="text" class="input-field course-name-input" placeholder="Nama Mata Kuliah" required>
            </td>
            <td>
                <input type="number" class="input-field course-credit-input" placeholder="SKS" min="1" max="6" step="1" required>
            </td>
            <td>
                <input type="number" class="input-field course-nsm-input" placeholder="0-100" min="0" max="100" step="0.01" required>
            </td>
            <td>
                <button type="button" class="btn btn-danger remove-btn" aria-label="Hapus">
                    <i class="ph ph-trash"></i>
                </button>
            </td>
        `;

        const removeBtn = tr.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            tr.style.transform = 'translateY(10px)';
            tr.style.opacity = '0';
            setTimeout(() => {
                tr.remove();
            }, 300);
        });

        // Intro animation
        tr.style.opacity = '0';
        tr.style.transform = 'translateY(-10px)';
        tr.style.transition = 'all 0.3s ease';
        courseList.appendChild(tr);

        // trigger reflow
        void tr.offsetWidth;

        tr.style.opacity = '1';
        tr.style.transform = 'translateY(0)';
    }

    async function calculateIPK() {
        const rows = document.querySelectorAll('#course-list tr');
        let courses = [];
        let isValid = true;

        rows.forEach((row, index) => {
            const name = row.querySelector('.course-name-input').value.trim() || `Course ${index + 1}`;
            const creditsStr = row.querySelector('.course-credit-input').value;
            const nsmStr = row.querySelector('.course-nsm-input').value;

            if (!creditsStr || !nsmStr) {
                isValid = false;
                row.querySelector('.course-credit-input').style.borderColor = 'var(--danger)';
                row.querySelector('.course-nsm-input').style.borderColor = 'var(--danger)';
            } else {
                row.querySelector('.course-credit-input').style.borderColor = 'var(--border-color)';
                row.querySelector('.course-nsm-input').style.borderColor = 'var(--border-color)';

                courses.push({
                    name: name,
                    credits: parseFloat(creditsStr),
                    nsm: parseFloat(nsmStr)
                });
            }
        });

        if (!isValid || courses.length === 0) {
            showCustomAlert('Harap isi minimal 1 mata kuliah beserta SKS dan Nilai NSM.');
            return;
        }

        loadingOverlay.classList.remove('hidden');

        try {
            // Send to Backend
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ courses: courses })
            });

            if (!response.ok) {
                throw new Error('Server Return Error ' + response.status);
            }

            const data = await response.json();

            displayResult(data);

        } catch (error) {
            console.error('Error calculating:', error);
            showCustomAlert('Gagal menghubungi server. Pastikan backend Flask sudah berjalan di port 5000.');
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    }

    function displayResult(data) {
        document.getElementById('result-ipk').innerText = data.ipk.toFixed(2);
        document.getElementById('result-sks').innerText = data.total_sks;
        document.getElementById('result-points').innerText = data.total_quality_points;

        const breakdownList = document.getElementById('result-breakdown');
        breakdownList.innerHTML = '';

        data.courses.forEach(course => {
            const div = document.createElement('div');
            div.className = 'breakdown-item';
            div.innerHTML = `
                <div class="item-left">
                    <span class="course-name">${course.name}</span>
                    <span class="course-details">${course.credits} SKS | NSM: ${course.nsm}</span>
                </div>
                <div class="item-right">
                    <div class="points-info">${course.points || course.quality_points} Poin Mutu</div>
                    <div class="grade-badge grade-${course.nmk}">${course.nmk}</div>
                </div>
            `;
            breakdownList.appendChild(div);
        });

        resultSection.classList.remove('hidden');

        // Scroll to result smoothly
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    function resetAll() {
        courseList.innerHTML = '';
        addCourseRow();
        addCourseRow();
        addCourseRow();
        resultSection.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
