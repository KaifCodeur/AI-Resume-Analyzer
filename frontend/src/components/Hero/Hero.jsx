import "./Hero.css";

function Hero({ title, description, buttonText }) {
  return (
    <section className="hero">
      <h1>{title}</h1>

      <p>{description}</p>
{buttonText && <button>{buttonText}</button>}
      
    </section>
  );
}

export default Hero;