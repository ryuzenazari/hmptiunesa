const Organization = require('../models/Organization');

// Get organization profile
exports.getOrganization = async (req, res) => {
  try {
    // Karena hanya ada 1 organization, kita ambil yang pertama
    const organization = await Organization.findOne()
      .populate('departments.head', 'nama email nim');
    
    if (!organization) {
      return res.status(404).json({ message: 'Profil organisasi belum diatur' });
    }
    
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Create or update organization
exports.updateOrganization = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Tambahkan user yang update
    updateData.updatedBy = req.user.id;
    
    const organization = await Organization.findOne();
    
    let result;
    
    if (organization) {
      // Update jika sudah ada
      result = await Organization.findByIdAndUpdate(
        organization._id,
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      // Create baru jika belum ada
      result = await Organization.create(updateData);
    }
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Add department
exports.addDepartment = async (req, res) => {
  try {
    const { name, description, head } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ message: 'Nama dan deskripsi departemen wajib diisi' });
    }
    
    const organization = await Organization.findOne();
    
    if (!organization) {
      return res.status(404).json({ message: 'Profil organisasi belum diatur' });
    }
    
    organization.departments.push({ name, description, head });
    await organization.save();
    
    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const updateData = req.body;
    
    const organization = await Organization.findOne();
    
    if (!organization) {
      return res.status(404).json({ message: 'Profil organisasi belum diatur' });
    }
    
    const departmentIndex = organization.departments.findIndex(
      dep => dep._id.toString() === departmentId
    );
    
    if (departmentIndex === -1) {
      return res.status(404).json({ message: 'Departemen tidak ditemukan' });
    }
    
    // Update field yang diberikan
    Object.keys(updateData).forEach(key => {
      organization.departments[departmentIndex][key] = updateData[key];
    });
    
    await organization.save();
    
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;
    
    const organization = await Organization.findOne();
    
    if (!organization) {
      return res.status(404).json({ message: 'Profil organisasi belum diatur' });
    }
    
    organization.departments = organization.departments.filter(
      dep => dep._id.toString() !== departmentId
    );
    
    await organization.save();
    
    res.status(200).json({ message: 'Departemen berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
}; 