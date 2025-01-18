import "./About.css";
import phong from './Github_Icons/phong.jpg'
import doanh from './Github_Icons/doanh.jpg'
import hien from './Github_Icons/hien.gif'
import huy from './Github_Icons/huy.jpg'

const About = () => {
  return (
    <body>
      <div id='Why'>
        <span className='large_text'>Why do we do this</span>
        <span className='medium_text'>Cause we like to move it move it Cause we like to move it move it Cause we like to move it move it </span>
      </div>
      <div className="flex items-center justify-center bg-gray-100">
        <div className='Person'>
          <img className='imageIcon' src={doanh} alt="Le Dang Doanh Phung"/>
          <div>Le Dang Doanh Phung</div>
        </div>
        <div className='Person'>
          <img className='imageIcon' src={hien} alt="eric Hien"/>
          <div>eric Hien</div>
        </div>
        <div className='Person'>
          <img className='imageIcon' src={phong} alt="Cao Thanh Phong"/>
          <div>Cao Thanh Phong</div>
        </div>
        <div className='Person'>
          <img className='imageIcon' src={huy} alt="Pham Gia Huy"/>
          <div>Pham Gia Huy</div>
        </div>
      </div>
      <script src="About.js"></script>
    </body>
  );
};

export default About;
