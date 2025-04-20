import React from 'react';
import Card from '../components/Card';
import '../styles/home.css';

const Home: React.FC = () => {
  return (
    <div className="page-container">
      <div className="content-container">
        <h1 className="page-title">
          Выберите режим игры
        </h1>
        
        <div className="cards-container">
          <Card
            title="Нашампурить Славика"
            ps="Нашампурь Славика от души"
            image="/assets/classic.jpg"
            mode="classic"
          />
          <Card
            title="BDSM"
            ps="Хочешь наказать Славика?"
            image="/assets/bdsm2.jpg"
            mode="bdsm"
          />
          <Card
            title="Однорукий бандит"
            ps="Ничего нажимать не нужно, просто наслаждайся"
            image="/assets/slot.jpg"
            mode="slot"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;