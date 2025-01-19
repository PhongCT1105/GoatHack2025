import "./About.css";
import phong from './Github_Icons/phong.jpg'
import doanh from './Github_Icons/doanh.jpg'
import hien from './Github_Icons/hien.gif'
import huy from './Github_Icons/huy.jpg'
import CatComponent from '../components/CatComponent';

const About = () => {
  return (
    <body className="flex flex-col items-center justify-center h-screen">
      <div id='Why' className="flex flex-col items-center justify-center h-screen">
        <span className='large_text'>Why we do this</span>
        <span className='medium_text'>Because we uiiiaiuiiiai </span>
        <div className="flex justify-center">
        <CatComponent />
      </div>
      </div>
      <div className="flex items-center justify-center">
        <div className='Person'>
          <img className='imageIcon' src={doanh} alt="Le Dang Doanh Phung" />
          <div>Le Dang Doanh Phung</div>
        </div>
        <div className='Person'>
          <img className='imageIcon' src={hien} alt="Hien Hoang" />
          <div>Hien Hoang</div>
        </div>
        <div className='Person'>
          <img className='imageIcon' src={phong} alt="Cao Thanh Phong" />
          <div>Cao Thanh Phong</div>
        </div>
        <div className='Person'>
          <img className='imageIcon' src={huy} alt="Pham Gia Huy" />
          <div>Pham Gia Huy</div>
        </div>
      </div>
      <script src="About.js"></script>
    </body>
  );
};

export default About;
