import React from 'react';

const ResourceLink = ({ title, description, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="block rounded-lg border border-gray-200 p-5 hover:bg-gray-50 transition"
  >
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-sm text-gray-600">{description}</p>
    <span className="mt-3 inline-block text-sm font-medium text-blue-600">Visit resource →</span>
  </a>
);

const AptitudePrep = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Aptitude & Soft Skills Prep</h1>
        <p className="mt-2 text-gray-600">
          Curated external resources to prepare for aptitude, soft skills, and matrices topics. These links
          open in a new tab.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Aptitude */}
        <ResourceLink
          title="Aptitude Practice - IndiaBix"
          description="Topic-wise quantitative aptitude questions with solutions and explanations."
          href="https://www.indiabix.com/aptitude/questions-and-answers/"
        />
        <ResourceLink
          title="GeeksforGeeks Aptitude"
          description="Aptitude, logical reasoning, and puzzles for interview preparation."
          href="https://www.geeksforgeeks.org/quiz-corner-gq/"
        />
        <ResourceLink
          title="HackerRank Interview Prep"
          description="Timed challenges and practice problems to build speed and accuracy."
          href="https://www.hackerrank.com/interview/interview-preparation-kit"
        />

        {/* Soft Skills */}
        <ResourceLink
          title="MindTools: Communication Skills"
          description="Practical guides to improve communication, presentations, and teamwork."
          href="https://www.mindtools.com/communication-skills"
        />
        <ResourceLink
          title="Coursera Soft Skills Courses"
          description="Curated courses on professional soft skills from leading universities."
          href="https://www.coursera.org/courses?query=soft%20skills"
        />
        <ResourceLink
          title="Harvard Negotiation Essentials"
          description="Foundational concepts to handle interviews and workplace discussions."
          href="https://www.pon.harvard.edu/daily/negotiation-skills-daily/"
        />

        {/* Matrices */}
        <ResourceLink
          title="Khan Academy: Matrices"
          description="Beginner-friendly lessons on matrices, operations, and applications."
          href="https://www.khanacademy.org/math/linear-algebra/matrix-transformations"
        />
        <ResourceLink
          title="3Blue1Brown: Linear Algebra"
          description="Visual intuition for matrices, vectors, and transformations."
          href="https://www.3blue1brown.com/topics/linear-algebra"
        />
        <ResourceLink
          title="MIT OCW Linear Algebra"
          description="Full university course with lectures, notes, and problem sets."
          href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
        />
      </div>
    </div>
  );
};

export default AptitudePrep;


