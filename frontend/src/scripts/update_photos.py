import json
import os

# Mendapatkan path absolut ke direktori frontend
frontend_dir = os.path.abspath(os.getcwd())
# Path ke file json
file_path = os.path.join(frontend_dir, 'src', 'data', 'members.json')

try:
    # Membaca file JSON
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Ubah URL foto untuk setiap member
    for member in data['membersList']:
        # Mengambil NIM mahasiswa
        nim = member['nim']
        # Mengubah URL foto menjadi format siakadu
        member['foto'] = f'https://siakadu.unesa.ac.id/photo/fotomhs/{nim}.jpg'
    
    # Menyimpan kembali file JSON yang telah diubah
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=2, ensure_ascii=False)
    
    print(f"Update foto berhasil! Total {len(data['membersList'])} foto mahasiswa diperbarui.")
    
except Exception as e:
    print(f"Terjadi kesalahan: {str(e)}") 