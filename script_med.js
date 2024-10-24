document.addEventListener("DOMContentLoaded", () => {
    const medicineForm = document.getElementById("medicineForm");
    const medicineTableBody = document.getElementById("medicineTableBody");

    let medicines = JSON.parse(localStorage.getItem("medicines")) || [];

    function addMedicine(medicine) {
        medicines.push(medicine);
        localStorage.setItem("medicines", JSON.stringify(medicines));
        renderMedicineTable();
    }

    function renderMedicineTable() {
        medicineTableBody.innerHTML = ""; 
        medicines.forEach((medicine, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${medicine.name}</td>
                <td>${medicine.quantity}</td>
                <td>${medicine.expiryDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn btn btn-warning btn-sm" onclick="editMedicine(${index})"><i class="fas fa-edit"></i> Edit</button>
                        <button class="delete-btn btn btn-danger btn-sm" onclick="deleteMedicine(${index})"><i class="fas fa-trash-alt"></i> Delete</button>
                    </div>
                </td>
            `;

            medicineTableBody.appendChild(row);
        });
    }

    medicineForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("medicineName").value;
        const quantity = document.getElementById("medicineQuantity").value;
        const expiryDate = document.getElementById("expiryDate").value;

        const medicine = {
            name,
            quantity,
            expiryDate
        };

        addMedicine(medicine);

        medicineForm.reset();
    });

    window.deleteMedicine = function (index) {
        medicines.splice(index, 1);
        localStorage.setItem("medicines", JSON.stringify(medicines));
        renderMedicineTable();
    };

    window.editMedicine = function (index) {
        const medicine = medicines[index];
        document.getElementById("medicineName").value = medicine.name;
        document.getElementById("medicineQuantity").value = medicine.quantity;
        document.getElementById("expiryDate").value = medicine.expiryDate;

        deleteMedicine(index);
    };

    renderMedicineTable();
});
