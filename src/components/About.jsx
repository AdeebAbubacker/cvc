import React from "react";
import { Tilt } from 'react-tilt';
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
//----------------------------------------------------
import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className='xs:w-[250px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
      >
        <img
          src={icon}
          alt='web-development'
          className='w-16 h-16 object-contain'
        />

        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        I'm a skilled software developer with extensive experience in Flutter, Dart, and
        mobile app development. Specializing in creating high-performance, visually
        appealing, and user-friendly cross-platform applications. Collaboration with
        clients is key to developing scalable solutions that address real-world challenges.
        Let's work together to turn your ideas into exceptional mobile experiences!
      </motion.p>
      <div className='mt-6 flex items-center gap-4'>
        <a
          href='#contact'
          className='bg-[#915EFF] hover:bg-[#7a4fd6] transition-colors text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-[#915EFF]/30'
        >
          Hire Me
        </a>

        <div className='flex gap-4'>
          <a
            href='https://github.com/AdeebAbubacker'
            target='_blank'
            rel='noreferrer'
            className='text-secondary hover:text-white transition-colors'
          >
            <FaGithub size={28} />
          </a>
          <a
            href='https://www.linkedin.com/in/adeeb-abubacker/'
            target='_blank'
            rel='noreferrer'
            className='text-secondary hover:text-white transition-colors'
          >
            <FaLinkedin size={28} />
          </a>
        </div>
      </div>
      <div className='mt-10 grid grid-cols-2 xs:grid-cols-4 gap-6'>
        {[
          { count: "4+", label: "Years Experience" },
          { count: "10+", label: "Apps Delivered" },
          { count: "10+", label: "Happy Clients" },
          { count: "2+", label: "Companies" },
        ].map(({ count, label }) => (
          <div key={label} className='flex flex-col items-center bg-tertiary rounded-2xl py-6 px-4 shadow-card'>
            <span className='text-[#915EFF] text-[32px] font-bold'>{count}</span>
            <span className='text-secondary text-[14px] text-center mt-1'>{label}</span>
          </div>
        ))}
      </div>

      <div className='mt-6 flex flex-wrap gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
