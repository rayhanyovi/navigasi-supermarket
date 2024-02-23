import React, { useState } from "react";
import { Button, Modal } from "antd";
const ModalBox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="text" onClick={showModal}>
        <h4 style={{ margin: 0, color: "white" }}>PETUNJUK</h4>
      </Button>
      <Modal
        title="Cara Menggunakan Aplikasi Navigasi Supermarket"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h4> Berikut Cara Menggunakan Aplikasi Navigasi Supermarket:</h4>
        <ol>
          {" "}
          <li>Tentukan daftar belanja anda</li>
          <li>
            Pilih barang-barang yang akan anda beli di daftar belanja yang ada
            pada bagian kanan halaman
          </li>
          <li>Tekan tombol "Buat Rute Belanja"</li>
          <li>
            Tunggu sesaat sampai aplikasi selesai menghitung rute belanja anda
          </li>
          <li>Ikuti rute belanja yang telah ditentukan oleh aplikasi</li>
        </ol>

        <h4>Selamat Berbelanja!</h4>
      </Modal>
    </>
  );
};

export default ModalBox;
