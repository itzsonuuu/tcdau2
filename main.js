let members = [];

document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('searchInput').addEventListener('input', handleSearch);
document.querySelector('.close').addEventListener('click', closeModal);

function handleFileUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        members = XLSX.utils.sheet_to_json(firstSheet);
        displayMembers(members);
    };

    reader.readAsArrayBuffer(file);
}

function displayMembers(membersToShow) {
    const grid = document.getElementById('membersGrid');
    grid.innerHTML = '';

    membersToShow.forEach(member => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <img src="${member.Photo || 'https://via.placeholder.com/200'}" alt="${member.Name}" class="member-photo">
            <div class="member-info">
                <div class="member-name">${member.Name}</div>
                <div>${member.Position || 'Member'}</div>
            </div>
        `;
        card.addEventListener('click', () => showMemberDetails(member));
        grid.appendChild(card);
    });
}

function showMemberDetails(member) {
    const modal = document.getElementById('modal');
    const details = document.getElementById('memberDetails');
    
    details.innerHTML = `
        <div class="bio-details">
            <img src="${member.Photo || 'https://via.placeholder.com/200'}" alt="${member.Name}">
            <h2>${member.Name}</h2>
            <div class="bio-info">
                ${Object.entries(member)
                    .filter(([key]) => key !== 'Photo')
                    .map(([key, value]) => `
                        <div class="bio-label">${key}:</div>
                        <div>${value}</div>
                    `).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredMembers = members.filter(member => 
        member.Name.toLowerCase().includes(searchTerm) ||
        (member.Position && member.Position.toLowerCase().includes(searchTerm))
    );
    displayMembers(filteredMembers);
}

// Close modal when clicking outside
window.onclick = function(e) {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
}