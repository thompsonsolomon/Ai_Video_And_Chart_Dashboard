import { motion } from "framer-motion";
import { FiInfo } from "react-icons/fi";

const questions = [
  "Tell us about yourself?",
  "Why do you think you are good at sales?",
  "What is the biggest deal you have closed?",
  "Why you choose this company?",
  "What your expectation in this company?",
];

// eslint-disable-next-line react/prop-types
const ProgressCircle = ({ value, label, color }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg className="w-20 h-20" viewBox="0 0 100 100">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth="10"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx="50"
          cy="50"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-xl font-semibold"
        >
          {value}%
        </text>
      </svg>
      <span className="mt-1 text-sm font-medium">{label}</span>
    </div>
  );
};

const DashboardCards = () => {
  return (
    <div className="flex  justify-center gap-6 px-5  bg-gray-100 text-[#666] ">
      {/* Card 1: Question List */}
      <motion.div
        className="w-80 h-[22rem] bg-white rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-black">Question List</h2>
          <FiInfo className="text-[#10b981]" />
        </div>
        <ul className="space-y-4">
          {questions.map((q, idx) => (
            <li key={idx} className="flex items-start">
              <span
                className={`w-7 h-7 mr-2 flex items-center justify-center rounded-full text-white text-sm font-bold ${idx < 2 ? "bg-[#10b981]" : "bg-gray-300"
                  }`}
              >
                {idx + 1}
              </span>
              <span className={`text-sm font-bold ${idx === 4 && "text-[#e2dad5]"
                }`}>{q}</span>
            </li>
          ))}
        </ul>
      </motion.div>
      <div className="flex gap-1  h-[22rem] bg-white shadow-lg rounded-[20px]">
        {/* Card 2: Score Summary */}
        <motion.div
          className="w-60 p-6  text-left  border-r-gray-100 border-r-[4px] "
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >

          <div className="flex flex-col justify-between items-right mb-2 gap-2">
            <FiInfo className="text-[#10b981]" />
            <h3 className="text-3xl font-bold text-black item-right mb-1">85%</h3>
          </div>
          <div className="text-gray-700 text-sm font-medium mb-2">
            <h4 className="text-[16px] font-bold text-black-600 item-right mb-3">
              AI Video Score Summary
            </h4>

            The presentation of talent is{" "}
            <strong>good</strong>. Check the breakdown summary of AI Video Score.
          </div>
          <div className="flex gap-2  mt-5 mb-2">
            <button className="px-[16px] py-[8px] border text-sm flex rounded-lg border-[#666] text-[#666] hover:bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span>
                Shortlist
              </span>
            </button>
            <button className="px-[16px] py-[8px] border text-sm flex rounded-lg border-[#666] text-[#666] hover:bg-green-100">              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              <span>
                Reject
              </span>
            </button>
          </div>
          <button className="mt-3 bg-green-600 text-white py-2 w-full px-4 rounded-[5px] hover:bg-green-700 transition">
            Hire Talent
          </button>
        </motion.div>

        {/* Card 3: Score Details */}
        <motion.div
          className="w-80  p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-center mb-4">
            AI Video Score Detail
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <ProgressCircle value={80} label="Professionalism" color="#10b981" />
            <ProgressCircle value={90} label="Business Acumen" color="#10b981" />
            <ProgressCircle value={65} label="Opportunistic" color="#f97316" />
            <ProgressCircle value={85} label="Closing Technique" color="#10b981" />
          </div>
        </motion.div>

      </div>

    </div>
  );
};

export default DashboardCards;
