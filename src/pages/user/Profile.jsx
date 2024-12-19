// import { useState, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiEdit2, FiSave, FiCamera, FiMail, FiPhone, FiBriefcase, FiCalendar } from 'react-icons/fi';
// import { useThemeStore } from '../../store/themeStore';
// import sampleUser from '../../assets/sample-user/sampleUser.jpg';

// const Profile = () => {
//   const theme = useThemeStore((state) => state.theme);
//   const [isEditing, setIsEditing] = useState(false);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const fileInputRef = useRef(null);
//   const [profileImage, setProfileImage] = useState(sampleUser);
//   const [profile, setProfile] = useState({
//     name: 'Jayant Roy',
//     email: 'jayanta@chandrakala.co.in',
//     phone: '+91 8400019683',
//     department: 'IT',
//     position: 'Full Stack Developer',
//     joinDate: '01-06-2024'
//   });

//   const handleImageClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const cardClass = theme === 'dark' 
//     ? 'bg-black/40 backdrop-blur-xl border-purple-500/20' 
//     : 'bg-white border-gray-200 shadow-lg';

//   const textClass = theme === 'dark' 
//     ? 'text-purple-100' 
//     : 'text-gray-900';

//   const subTextClass = theme === 'dark' 
//     ? 'text-purple-300' 
//     : 'text-gray-600';

//   const inputClass = theme === 'dark'
//     ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 focus:border-purple-400'
//     : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500';

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Left Column - Profile Image & Basic Info */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className={`lg:col-span-1 border rounded-2xl ${cardClass} overflow-hidden`}
//         >
//           <div className="relative h-60 bg-gradient-to-br from-purple-600 to-pink-500">
//             <div className="absolute -bottom-20 inset-x-0 flex justify-center">
//               <div className="relative group">
//                 <div className="w-40 h-40 rounded-full border-4 border-purple-500/20 overflow-hidden bg-black/40 backdrop-blur-xl">
//                   <motion.img 
//                     src={profileImage} 
//                     alt="Profile" 
//                     className="w-full h-full object-cover"
//                     style={{ width: '160px', height: '160px' }}
//                     whileHover={{ scale: 1.1 }}
//                     transition={{ duration: 0.3 }}
//                   />
//                 </div>
//                 <button 
//                   onClick={handleImageClick}
//                   className="absolute bottom-0 right-0 p-2 rounded-full bg-purple-600 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-purple-700"
//                 >
//                   <FiCamera className="w-4 h-4" />
//                 </button>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleImageChange}
//                   accept="image/*"
//                   className="hidden"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="px-6 pt-24 pb-6 text-center">
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="name"
//                 value={profile.name}
//                 onChange={handleChange}
//                 className={`text-2xl font-bold text-center w-full rounded-lg border p-2 mb-1 ${inputClass}`}
//               />
//             ) : (
//               <h1 className={`text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400`}>
//                 {profile.name}
//               </h1>
//             )}
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="position"
//                 value={profile.position}
//                 onChange={handleChange}
//                 className={`text-center w-full rounded-lg border p-2 mb-4 ${inputClass}`}
//               />
//             ) : (
//               <p className={`${subTextClass} mb-4`}>{profile.position}</p>
//             )}
//             <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
//               theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'
//             }`}>
//               <FiBriefcase className="w-4 h-4" />
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="department"
//                   value={profile.department}
//                   onChange={handleChange}
//                   className={`w-24 text-center rounded-lg border p-1 ${inputClass}`}
//                 />
//               ) : (
//                 <span className={subTextClass}>{profile.department}</span>
//               )}
//             </div>
//           </div>
//         </motion.div>

//         {/* Right Column - Detailed Info */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className={`lg:col-span-2 border rounded-2xl ${cardClass} p-6`}
//         >
//           <div className="flex justify-between items-center mb-6">
//             <h2 className={`text-xl font-semibold ${theme === 'dark' ? textClass : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-600'}`}>Profile Information</h2>
//             {/* for edting */}
//             {/* <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setIsEditing(!isEditing)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
//                 theme === 'dark'
//                   ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300'
//                   : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
//               }`}
//             >
//               {isEditing ? (
//                 <>
//                   <FiSave className="w-5 h-5" />
//                   <span>Save</span>
//                 </>
//               ) : (
//                 <>
//                   <FiEdit2 className="w-5 h-5" />
//                   <span>Edit</span>
//                 </>
//               )}
//             </motion.button> */}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               { icon: <FiMail />, label: 'Email', value: profile.email, name: 'email' },
//               { icon: <FiPhone />, label: 'Phone', value: profile.phone, name: 'phone' },
//               { icon: <FiBriefcase />, label: 'Department', value: profile.department, name: 'department' },
//               { icon: <FiCalendar />, label: 'Join Date', value: profile.joinDate, name: 'joinDate' }
//             ].map((item, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ scale: 1.02 }}
//                 className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'}`}
//               >
//                 <div className="flex items-center gap-3 mb-2">
//                   <span className={`${subTextClass}`}>{item.icon}</span>
//                   <span className={`text-sm ${subTextClass}`}>{item.label}</span>
//                 </div>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     name={item.name}
//                     value={item.value}
//                     onChange={handleChange}
//                     className={`w-full rounded-lg border p-2 ${inputClass}`}
//                   />
//                 ) : (
//                   <p className={`${textClass} font-medium`}>{item.value}</p>
//                 )}
//               </motion.div>
//             ))}
//           </div>

//           <div className="mt-6">
//             <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? textClass : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-100'}`}>Recent Activity</h3>
//             <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
//               <p className={subTextClass}>No recent activity to display</p>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Profile;


import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiCamera, FiMail, FiPhone, FiBriefcase, FiCalendar, FiMapPin, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { useThemeStore } from '../../store/themeStore';
import sampleUser from '../../assets/sample-user/sampleUser.jpg';

const Profile = () => {
  const theme = useThemeStore((state) => state.theme);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(sampleUser);
  const [profile, setProfile] = useState({
    name: 'Jayant Roy',
    email: 'jayanta@chandrakala.co.in',
    phone: '+91 8400019683',
    department: 'IT',
    position: 'Full Stack Developer',
    joinDate: '01-06-2024',
    location: 'Prayagraj , India',
    bio: 'Passionate Full Stack Developer with expertise in React, Node.js, and Cloud Technologies.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
    social: {
      github: 'github.com/jayantroy',
      linkedin: 'linkedin.com/in/jayantroy',
      twitter: 'twitter.com/jayantroy'
    }
  });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (skill) => {
    if (profile.skills.includes(skill)) {
      setProfile(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s !== skill)
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const cardClass = theme === 'dark' 
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20' 
    : 'bg-white border-blue-200 shadow-lg';

  const textClass = theme === 'dark' 
    ? 'text-purple-100' 
    : 'text-blue-900';

  const subTextClass = theme === 'dark' 
    ? 'text-purple-300' 
    : 'text-blue-600';

  const inputClass = theme === 'dark'
    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 focus:border-purple-400'
    : 'bg-blue-50 border-blue-200 text-blue-900 focus:border-blue-500';

  const gradientClass = theme === 'dark'
    ? 'from-purple-600 to-pink-500'
    : 'from-blue-600 to-blue-400';

  const nameGradientClass = theme === 'dark'
    ? 'from-purple-400 to-pink-400'
    : 'from-blue-600 to-blue-400';

  const badgeClass = theme === 'dark'
    ? 'bg-purple-900/20'
    : 'bg-blue-50';

  const buttonClass = theme === 'dark'
    ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300'
    : 'bg-blue-100 hover:bg-blue-200 text-blue-700';

  const infoCardClass = theme === 'dark'
    ? 'bg-purple-900/20'
    : 'bg-blue-50';

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative border rounded-2xl ${cardClass} overflow-hidden`}
      >
        {/* Banner Image - Hidden on mobile */}
        <div className={`hidden sm:block h-48 bg-gradient-to-r relative overflow-hidden ${
          theme === 'dark'
            ? 'from-purple-600 via-pink-500 to-purple-600'
            : 'from-blue-500 via-blue-600 to-blue-700'
        }`}>
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col lg:flex-row gap-6 relative">
            {/* Profile Image - Adjusted positioning for mobile */}
            <div className="sm:-mt-16 flex justify-center pt-6 sm:pt-0">
              <div className="relative group">
                <div className={`w-40 h-40 rounded-full border-4 ${
                  theme === 'dark' 
                    ? 'border-purple-500/20' 
                    : 'border-blue-200'
                } overflow-hidden bg-black/40 backdrop-blur-xl`}>
                  <motion.img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <button 
                  onClick={handleImageClick}
                  className={`absolute bottom-0 right-0 p-2 rounded-full ${
                    theme === 'dark'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                >
                  <FiCamera className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Name and Basic Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className={`text-3xl font-bold w-full rounded-lg border p-2 ${inputClass}`}
                    />
                  ) : (
                    <h1 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${nameGradientClass}`}>
                      {profile.name}
                    </h1>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <FiMapPin className={subTextClass} />
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        className={`rounded-lg border p-1 ${inputClass}`}
                      />
                    ) : (
                      <span className={subTextClass}>{profile.location}</span>
                    )}
                  </div>
                </div>
                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300'
                      : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <FiSave className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <FiEdit2 className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </motion.button> */}
              </div>

              {/* Bio */}
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  className={`w-full rounded-lg border p-2 ${inputClass}`}
                  rows={3}
                />
              ) : (
                <p className={subTextClass}>{profile.bio}</p>
              )}

              {/* Social Links */}
              <div className="flex gap-4">
                {Object.entries(profile.social).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={`https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${
                      theme === 'dark'
                        ? 'text-purple-400 hover:text-purple-300'
                        : 'text-blue-400 hover:text-blue-300'
                    } transition-colors`}
                  >
                    {platform === 'github' && <FiGithub className="w-5 h-5" />}
                    {platform === 'linkedin' && <FiLinkedin className="w-5 h-5" />}
                    {platform === 'twitter' && <FiTwitter className="w-5 h-5" />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skills and Details Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`border rounded-2xl ${cardClass} p-6`}
        >
          <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className={`px-3 py-1 rounded-full text-sm ${
                  theme === 'dark'
                    ? 'bg-purple-900/20 text-purple-300'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-2 border rounded-2xl ${cardClass} p-6`}
        >
          <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: <FiMail />, label: 'Email', value: profile.email, name: 'email' },
              { icon: <FiPhone />, label: 'Phone', value: profile.phone, name: 'phone' },
              { icon: <FiBriefcase />, label: 'Department', value: profile.department, name: 'department' },
              { icon: <FiCalendar />, label: 'Join Date', value: profile.joinDate, name: 'joinDate' }
            ].map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={subTextClass}>{item.icon}</span>
                  <span className={`text-sm ${subTextClass}`}>{item.label}</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name={item.name}
                    value={item.value}
                    onChange={handleChange}
                    className={`w-full rounded-lg border p-2 ${inputClass}`}
                  />
                ) : (
                  <p className={`${textClass} font-medium`}>{item.value}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
