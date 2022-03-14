import React from "react";
import RedeemView from './[namaQuery]';
import HistoryView from './history';
import { useRouter } from "next/router";


const MakanKaryawan = () => {
  const router = useRouter();
  const { namaQuery } = router.query;

  return (
    <div>
      {namaQuery ? (
        <RedeemView />
      ) : (
        <HistoryView />
      )}
    </div>
    
  );
};

export default MakanKaryawan;
