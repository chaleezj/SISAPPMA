import React, { useState, useRef, useEffect } from 'react';
import logo from "../../Assets/diskominfo.png";
import Dates from '../../Assets/Date';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../Components/SideBar/Navbar.css";
import "./Presensi.css"
import jwt_decode from "jwt-decode";
import axios from 'axios';
import './UserPages.css';
import { TabTitle } from '../../TabName';
import { isUnauthorizedError } from '../../config/errorHandling';
import { useNavigate } from 'react-router-dom';
import { axiosJWTuser } from '../../config/axiosJWT';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { showSuccessNotification } from '../../Components/User/toastSuccess';
import { showErrorNotification } from '../../Components/User/toastFailed'
import icon from "../../Assets/icon.png";
import Footer from "./footer";

const Presensi = () => {
  TabTitle('Presensi');
  const videoRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [captureTime, setCaptureTime] = useState(null);
  const [showNav, setShowNav] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        await axios.get('http://localhost:3000/account/token', {
          headers: {
            'role': "peserta_magang"
          },
        });
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        if (isUnauthorizedError(error)) {
          navigate('/');
        }
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [navigate]);

  const capture = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const capturedImageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    const capturedImageFile = new File([capturedImageBlob], 'captured-image.jpg', { type: 'image/jpeg' });

    setImageSrc(capturedImageFile);
    setCaptureTime(new Date());
    console.log('Captured Image:', capturedImageFile);
  };

  useEffect(() => {
    if (captureTime) {
      console.log('Capture Time:', captureTime);
    }
  }, [captureTime]);

  const uploadImage = async () => {
    try {
        const ambilid = await axios.get('http://localhost:3000/account/token', {
            headers: {
                'role': "peserta_magang"
            },
        });

        console.log('Token response:', ambilid.data);

        const decoded = jwt_decode(ambilid.data.token);

        console.log('Decoded token:', decoded);

        if (!imageSrc) {
            throw new Error('No image captured');
        }

        const formData = new FormData();
        formData.append('image', imageSrc);

        console.log('FormData:', formData);

        const response = await axiosJWTuser.patch(`http://localhost:3000/user/presensi/${decoded.userId}/up`, formData, {
            headers: {
                'role': "peserta_magang",
                'Content-Type': 'multipart/form-data' 
            }
        });

        console.log('Server Response:', response.data);
        showSuccessNotification("Berhasil Melakukan Presensi");
    } catch (error) {

        // DEBUGGING
        console.error("Error object:", error);

        if (error.response && error.response.data && error.response.data.message) {
            console.error("Error response data:", error.response.data);
            showErrorNotification(`Gagal Melakukan Presensi: ${error.response.data.message}`); 
        } else if (error.message) {
            showErrorNotification(`Gagal Melakukan Presensi: ${error.message}`); 
        }

        if (isUnauthorizedError(error)) {
            navigate('/');
        }

        console.error("Error detail:", error);
    }
};



  return (
    <div className="body-main">
      <div className={`body-area${showNav ? " body-pd" : ""}`}>
        <header className={`header${showNav ? " body-pd" : ""}`}>
          <div className="header_toggle">
          </div>
          <div className="header_img">
            <img src={icon} alt="" />
          </div>
        </header>
        <div className={`sidebar${showNav ? " open" : ""}`}> 
          <div className="logo-details">
            <i className='bx bxl-c-plus-plus icon'></i>
            <a href="/user/homepage" target="_self" className="logo_name">
              <img src={logo} alt="" style={{ width: "120px", height: "auto" }} />
            </a>
            <i className='bi-list' id="btn" onClick={() => setShowNav(!showNav)}></i>
          </div>
          <ul className="nav-list">
            <li>
              <a href="homepage">
                <i className="bi bi-house nav_icon" />
                <span className="links_name">Home</span>
              </a>
              <span className="tooltip">Home</span>
            </li>
            <li>
              <a href="riwayat">
                <i className="bi bi-card-checklist nav_icon" />
                <span className="links_name">History Presensi</span>
              </a>
              <span className="tooltip">History Presensi</span>
            </li>
            <li>
              <a href="presensi">
                <i className="bi bi-camera nav_icon" />
                <span className="links_name">Lakukan Presensi</span>
              </a>
              <span className="tooltip">Lakukan Presensi</span>
            </li>
            <li>
              <a href="tugas">
                <i className="bi bi-list-task nav_icon" />
                <span className="links_name">Penugasan</span>
              </a>
              <span className="tooltip">Penugasan</span>
            </li>
            <li>
              <a href="surat">
                <i className="bi bi-envelope nav_icon" />
                <span className="links_name">Persuratan</span>
              </a>
              <span className="tooltip">Persuratan</span>
            </li>
            <li>
              <a href="profil">
                <i className="bi bi-person nav_icon"></i>
                <span className="links_name">Profile</span>
              </a>
              <span className="tooltip">Profile</span>
            </li>
            <li className="profile">
              <a href="/">
                <i className="bi bi-box-arrow-left nav_icon"></i>
                <span className="links_name">Sign Out</span>
              </a>
            </li>
          </ul>
        </div>
        <div className={"home-section"} style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
          <h1 style={{ marginBottom: "10px" }}>Silahkan Presensi</h1>
          <div> <Dates style={{ display: 'flex', alignItems: 'end' }} /> </div>
          <div>Jadwal Presensi : </div>
          <div className='jadwal-absen'>
            <div className='flexs' style={{gap:"5px", backgroundColor:"#5CB85C", borderRadius:"10px", color:"white", padding:"3px 8px"}}>
              <div className='widtha'>
                <p>Senin-Kamis</p>
                <p>:</p>
              </div>
              <div>
                <p>Pagi 7.45-8.15 WIB</p>
                <p> Sore 15.45-16.15 WIB</p>
              </div>
            </div>
            <div className='flexs' style={{ gap:"5px", backgroundColor:"#5CB85C", borderRadius:"10px", color:"white", padding:"3px 8px"}}>
              <div className='widtha'>
                <p>Jumat</p>
                <p>:</p>
              </div>
              <div>
                <p>Pagi 7.45-8.15 WIB</p>
                <p> Sore 13.45-14.15 WIB</p>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', }}>
              <video ref={videoRef} autoPlay style={{ width: '40vw', height: 'auto' }} />
              {imageSrc && <img src={URL.createObjectURL(imageSrc)} alt="Selfie" style={{ width: '40vw', height: 'auto', marginLeft: "10px" }} />}
            </div>
            <div style={{ display: 'flex', marginTop: "10px", gap:"5px" }}>
              <button className='button-foto' onClick={capture}>Ambil Foto</button>
              <button className='button-kirim' onClick={uploadImage}>Kirim Absensi</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer /> 
    </div>
  );
};

export default Presensi;
