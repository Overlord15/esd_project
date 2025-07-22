import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FiCalendar,
  FiList,
  FiUsers,
  FiMessageSquare,
  FiCheckSquare,
  FiBarChart2,
} from "react-icons/fi";

type SectionProps = {
  dark?: boolean;
  mt?: boolean;
};

// --- Base Styling ---

const Wrapper = styled.div`
  background: linear-gradient(180deg, #745be7 0%, #352477 40%, #eaefff 100%);
  min-height: 100vh;
  color: #23262f;
  font-family: 'Inter', 'Ubuntu', Arial, sans-serif;
  overflow-x: hidden; // Prevents skew overflow
`;

const NavBar = styled.nav`
  width: 100%;
  padding: 2rem 6vw 0 6vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 20;
`;

const Logo = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -2px;
  color: #ffffff;
`;

const LoginButton = styled(Link)`
  background: #5c4be7;
  color: #fff;
  border-radius: 36px;
  padding: 12px 28px;
  font-size: 1.05rem;
  transition: background 0.22s;
  text-decoration: none;
  font-weight: 700;
  &:hover { background: #3726c9; }
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 1rem 6rem 1rem;
`;

const HeroTitle = styled.h2`
  font-size: 2.6rem;
  color: #fff;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1px;
`;

const HeroSub = styled.p`
  font-size: 1.3rem;
  color: #efe1fa;
  margin: 1.8rem auto 2.5rem auto;
  max-width: 600px;
`;

// const HeroImage = styled.img`
//   width: 700px;
//   max-width: 97vw;
//   margin-top: 3rem;
//   box-shadow: 0 5px 48px 0 #8474ed86;
//   border-radius: 22px;
//   background: #26135c80;
// `;

// --- Visual Divider ---

const SkewDivider = styled.div`
  width: 105vw;
  height: 100px;
  background: linear-gradient(90deg, #804cdf 0%, #39236c 100%);
  transform: skewY(-3deg);
  margin-top: 4rem;
  position: relative;
  left: -2.5vw;
`;

// --- Feature Grid (Glassmorphism) ---

const GlassFeatureGrid = styled.div`
  margin: 0 auto;
  margin-top: -80px;
  margin-bottom: 4rem;
  max-width: 700px;
  width: 90%;
  box-shadow: 0 6px 32px #00000066;
  border-radius: 18px;
  background: rgba(44, 17, 91, 0.67);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(176, 162, 254, 0.4);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  padding: 2rem 1rem;
  gap: 1rem;
  color: #ece1fa;
  position: relative;
  z-index: 10;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
  }

  & svg {
    font-size: 2rem;
    color: #b49dff;
  }
`;

// --- Main Content Sections ---

const Section = styled.section<SectionProps>`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 3rem 1rem;
  border-radius: 22px;
  background: ${(p) => (p.dark ? "#11122a" : "#fff9fd")};
  box-shadow: ${(p) => (p.dark ? "0 6px 32px #00000055" : "0 2px 18px #644fd711")};
  margin-top: ${(p) => (p.mt ? "4rem" : "0")};
  color: ${(p) => (p.dark ? "#fff" : "#23262f")};
`;

const FeaturesFlex = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  flex: 1;
  min-width: 200px;
  max-width: 320px;
  background: #ffffff18;
  border-radius: 16px;
  padding: 1.2rem;
  text-align: center;
`;

const CodePreview = styled.img`
  width: 100%;
  max-width: 630px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 2px 24px #8794fc99;
  display: block;
`;

// --- Testimonials & Footer ---

const Testimonials = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3vw;
  margin: 2.5rem auto 0;
  justify-content: center;
  max-width: 1120px;
`;

const TestimonialCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.4rem 2rem;
  margin-bottom: 1rem;
  max-width: 320px;
  flex: 1;
  color: #000000
`;

const Footer = styled.footer`
  color: #8b94b1;
  text-align: center;
  padding: 2.5rem 0 2rem 0;
`;

const Home: React.FC = () => (
  <Wrapper>
    <NavBar>
      <Logo>OpenCollab</Logo>
      <LoginButton to="/login">Login</LoginButton>
    </NavBar>

    <HeroSection>
      <HeroTitle>Organize, Collaborate, Succeed—Together</HeroTitle>
      <HeroSub>
        OpenCollab brings your team’s calendar, tasks, and communication into one seamless, 
        web-based platform. Register once and access everything you need for productive collaboration.
      </HeroSub>
      {/* Replace with your actual app screenshot */}
      {/* <HeroImage src="/opencollab-preview.png" alt="OpenCollab dashboard screenshot" /> */}
    </HeroSection>

    <SkewDivider />
    <GlassFeatureGrid>
      <div>
        <FiCalendar />
        Smart Calendar
      </div>
      <div>
        <FiList />
        Task Manager
      </div>
      <div>
        <FiUsers />
        Project Spaces
      </div>
      <div>
        <FiMessageSquare />
        Real-Time Chat
      </div>
      <div>
        <FiCheckSquare />
        Progress Tracking
      </div>
      <div>
        <FiBarChart2 />
        Member Roles
      </div>
    </GlassFeatureGrid>

    <Section dark>
      <h2 style={{ fontWeight: 800, fontSize: "2rem", textAlign: "center", marginBottom: 12 }}>
        Everything Your Team Needs, in One Place
      </h2>
      <div style={{ color: '#afa7ce', fontSize: '1.15rem', margin: '0 auto 2.2rem auto', maxWidth: 520, textAlign: "center" }}>
        OpenCollab is designed for teams who want to stay organized, communicate clearly, and track progress effortlessly.
      </div>
      <FeaturesFlex>
        <FeatureCard>
          {/* <img src="/calendar-icon.png" alt="Calendar" style={{height:'56px'}}/> */}
          <h3>Calendar & Reminders</h3>
          <p>
            Plan meetings, set reminders, and never miss a deadline. Sync with your favorite calendar apps.
          </p>
        </FeatureCard>
        <FeatureCard>
          {/* <img src="/tasks-icon.png" alt="Tasks" style={{height:'56px'}}/> */}
          <h3>Task Manager</h3>
          <p>
            Create, assign, and track to-do items. Prioritize your work and stay on top of your responsibilities.
          </p>
        </FeatureCard>
        <FeatureCard>
          {/* <img src="/collab-icon.png" alt="Collaboration" style={{height:'56px'}}/> */}
          <h3>Project Spaces</h3>
          <p>
            Create dedicated spaces for each project. Add members, assign tasks, chat in real time, and monitor progress.
          </p>
        </FeatureCard>
      </FeaturesFlex>
    </Section>

    <Section mt>
      <h2 style={{ fontWeight: 800, fontSize: "2rem", textAlign: 'center' }}>
        Features Built for Productivity
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3vw', alignItems: 'center', marginTop: '2rem', justifyContent: 'center' }}>
        {/* Replace with your actual app interface screenshot */}
        <CodePreview src="/opencollab-interface.png" alt="OpenCollab interface" />
        <ul style={{ maxWidth: 340, fontSize: '1.12rem', color: '#23262f', listStylePosition: 'inside' }}>
          <li><strong>Team Calendar:</strong> Visualize schedules and set reminders for everyone.</li>
          <li><strong>Task Boards:</strong> Manage to-dos, subtasks, and deadlines with ease.</li>
          <li><strong>Project Spaces:</strong> Invite members, assign roles, and centralize project communication.</li>
          <li><strong>Real-Time Chat:</strong> Discuss tasks, share updates, and make decisions instantly.</li>
          <li><strong>Progress Tracking:</strong> Monitor task completion and project milestones in real time.</li>
        </ul>
      </div>
    </Section>

    <Section dark mt>
      <h2 style={{ fontWeight: 800, fontSize: "1.8rem", marginBottom: 18 }}>
        Trusted by Teams Who Get Things Done
      </h2>
      <Testimonials>
        <TestimonialCard>
          <strong style={{color:"yellow"}}>⭐⭐⭐⭐⭐</strong>
          <div style={{marginTop:6}}>“OpenCollab transformed how our remote team coordinates. The calendar and task features are lifesavers.”<br/><span style={{fontWeight:600}}>– Priya, Project Lead</span></div>
        </TestimonialCard>
        <TestimonialCard>
          <strong>⭐⭐⭐⭐⭐</strong>
          <div style={{marginTop:6}}>“Creating project spaces and assigning tasks has never been simpler. The chat keeps everyone connected.”<br/><span style={{fontWeight:600}}>– Alex, Developer</span></div>
        </TestimonialCard>
        <TestimonialCard>
          <strong>⭐⭐⭐⭐⭐</strong>
          <div style={{marginTop:6}}>“The reminders and progress tracking help us stay on track—no more missed deadlines!”<br/><span style={{fontWeight:600}}>– Sam, Product Manager</span></div>
        </TestimonialCard>
      </Testimonials>
    </Section>

    <Footer>
      Ready to boost your team’s productivity?<br />
      <span style={{ color: "#4f46e5", fontWeight: 600 }}>
        Get started today — <Link to="/login" style={{ color: "#4f46e5" }}>Register for free</Link>
      </span>
      <div style={{ fontSize: '.9em', color: '#8c9bf7', marginTop: '1.5em' }}>© 2025 OpenCollab Team</div>
    </Footer>
  </Wrapper>
);

export default Home;
