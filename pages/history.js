import React from "react";
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  IconDompet,
  IconAlert,
  IconProfil,
  IconDepartemen,
  IconPassword,
  IconEye,
  IconEyeoff,
} from "../public";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { API_URL } from "../constants/API";
import QRCode from "qrcode";

const MakanKaryawan = () => {
  const [seePass, setSeePass] = useState(false);
  const [id, setId] = useState("");
  const [nama, setNama] = useState("");
  const [departemen, setDepartemen] = useState("");
  const [voucher, setVoucher] = useState();
  const [history, setHistory] = useState([]);
  const [pass, setPass] = useState(false);
  const [QR, setQR] = useState("");

  const router = useRouter();
  const { namaQuery } = router.query;

  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  const fetchData = async () => {
    const result = await axios(`${API_URL}/karyawan/get?nama=${namaQuery}`);
    if (result.data[0]) {
      setId(result.data[0].id_karyawan);
      setNama(result.data[0].nama);
      setDepartemen(result.data[0].departemen);
      setVoucher(result.data[0].sisa_voucher);

      QRCode.toDataURL(`https://voucher.roastkuy.com/fauzi`).then(setQR);

      const redeem = await axios(
        `${API_URL}/redeem_voucher/get?id_karyawan=${result.data[0].id_karyawan}`
      );
      if (redeem){
        setHistory(redeem.data);
        console.log(redeem.data)
      }
    }
  };

  const fetchHistory = async () => {
    const redeem = await axios(`${API_URL}/redeem_voucher/get`);
    if (redeem) setHistory(redeem.data);
    console.log(redeem.data)
  };

  useEffect(() => {
    if (namaQuery) {
      fetchData();
    }  else{fetchHistory()}
  }, [namaQuery]);

  const handleSubmit = () => {
    if (pass)
      if (pass.target.value == "kuymaret") {
        const body = {
          id_karyawan: id,
          tanggal_redeem: date,
          jam_redeem: time,
        };

        axios.post(`${API_URL}/redeem_voucher/add-redeem`, body).then((res) => {
          console.log(res);
          axios
            .patch(`${API_URL}/karyawan/update_voucher/${id}`, {
              sisa_voucher: voucher - 1,
            })
            .then((res2) => {
              console.log(res2);
              fetchData();
              setPass("");
            });
        });
      }
  };

  return (
    <div className="mx-auto max-w-md rounded bg-white py-12 shadow-2xl lg:max-w-4xl">
      <Head>
        <title>History Redeem</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto max-w-md px-2 lg:max-w-2xl">
        <div className="flex rounded-lg bg-green-100 p-2 text-sm text-green-700">
          <div className="flex h-8 w-8 flex-col items-center justify-center">
            <IconAlert />
          </div>
          <div className="flex items-center justify-center">
            <span className="mx-2 font-medium">
              History
            </span>
            Redeem Voucher Roastkuy
          </div>
        </div>
        
      </div>

      <div className="mx-auto w-5/6">
        <div className="container mx-auto flex w-full max-w-md flex-col items-center justify-center lg:max-w-3xl ">
          <ul className="flex w-full flex-col divide-y">
            {history.map((e, i) => (
              <li key={Math.random()} className="flex flex-row ">
                <div className="flex  flex-1 select-none items-center p-2 hover:bg-gray-50">
                  <div className="mr-4 flex h-10 w-10 flex-col items-center justify-center">
                    <IconDompet />
                  </div>
                  <div className="mr-16 flex-1">
                    <div className="text-sm">
                      Redeem {i + 1}
                    </div>
                    <div className="text-sm ">
                      {e.nama}
                    </div>
                  </div>
                  <div className="pr-4">
                    <div className="text-sm ">
                      {moment(e.tanggal_redeem).format("ll")}
                    </div>
                    <div className="text-sm ">
                      {e.jam_redeem}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default MakanKaryawan;
