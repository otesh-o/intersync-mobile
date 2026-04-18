export const arrowVector = require('../../assets/images/Vector.png');
export const folderIcon = require('../../assets/images/foldericon.png');
export const homeIcon = require('../../assets/images/homeicon.png');
export const bookmarkIcon = require('../../assets/images/bookmark.png');


export const JOBS_DATA = [
  { id: 1, title: 'Software Engineer', company: 'Linear', location: 'Jakarta, ID', salary: '$50 - $75 / Mo', image: 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, title: 'Product Manager', company: 'Stripe', location: 'San Francisco, CA', salary: '$120 - $150 / k', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop' },
  { id: 3, title: 'UX Designer', company: 'Figma', location: 'Remote', salary: '$90 - $110 / k', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop' },
  { id: 4, title: 'Frontend Developer', company: 'Vercel', location: 'Remote', salary: '$80 - $100 / k', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, 'title': 'Backend Developer', company: 'Supabase', location: 'London, UK', salary: '$85 - $105 / k', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop' },
  { id: 6, title: 'Data Scientist', company: 'OpenAI', location: 'San Francisco, CA', salary: '$130 - $160 / k', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' },
];


export const PROFILE_PIC_URL = 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop';
export const CARD_BACKGROUND_URL = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop';


export const TUTORIAL_STEPS = [
    { title: '👋 Hey There!', text: "Let's Personalize Your Journey.\nTap \"View Your Profile Here!\" To Update Your Details And Unlock A Tailored Experience.", modalPosition: { top: 180, alignSelf: 'center' }, spotlight: { top: 118, left: 18, width: 60, height: 60 }, highlightedComponent: { type: 'image', source: { uri: PROFILE_PIC_URL } } },
    { icon: 'menu-outline', title: 'Explore More', text: 'Discover Internship, Volunteer And Club Activity Opportunities.', modalPosition: { top: 75, left: 70 }, arrowStyle: { top: 1, left: -25, transform: [{ rotate: '180deg' }] }, spotlight: { top: 52, left: 18, width: 45, height: 45 }, highlightedComponent: { type: 'icon', name: 'menu', size: 30, color: '#000' } },
    { icon: 'notifications-outline', title: 'Let\'s Keep You Informed.', text: 'Tap The 🔔 Notification Icon To Check Important Updates.', modalPosition: { top: 140, right: 65 }, spotlight: { top: 120, right: 18, width: 45, height: 45 }, highlightedComponent: { type: 'icon', name: 'notifications-outline', size: 28, color: '#000' } },
    { icon: 'return-down-back-outline', title: 'Swipe Left Card', text: 'Reject An Internship Quickly And Easily.', modalPosition: { top: '55.5%', left: 40 }, arrowStyle: { bottom: 20, left: -35, transform: [{ rotate: '180deg' }] }, spotlight: { top: '78.5%', left: 70, width: 65, height: 65 }, highlightedComponent: { type: 'icon', name: 'close', size: 30, color: '#fff', backgroundColor: '#FC8181' } },
    { icon: 'return-down-forward-outline', title: 'Swipe Right Card', text: 'Shortlist Or Mark The Internship As OK.', modalPosition: { top: '55.5%', right: 40 }, arrowStyle: { bottom: 20, right: -35, transform: [{ rotate: '180deg' }, { scaleX: -1 }] }, spotlight: { top: '78.5%', right: 70, width: 65, height: 65 }, highlightedComponent: { type: 'icon', name: 'checkmark', size: 30, color: '#fff', backgroundColor: '#68D391' } },
    { icon: 'add-circle-outline', title: 'Tap The Plus Icon', text: 'See More Details About The Internship.', modalPosition: { top: '55.5%', alignSelf: 'center' }, arrowStyle: { bottom: -25, alignSelf: 'center', transform: [{ rotate: '90deg' }], marginLeft: -15.5 }, spotlight: { top: '78.55%', alignSelf: 'center', width: 65, height: 65, marginLeft: -.5 }, highlightedComponent: { type: 'icon', name: 'add', size: 30, color: '#fff', backgroundColor: '#2D3748' } },
    { icon: 'reader-outline', title: 'Application Tracker', text: 'View The List Of Internships You\'ve Applied To.', modalPosition: { bottom: 130, left: 25 }, arrowStyle: { bottom: -30, left: 20, transform: [{ rotate: '90deg' }] }, spotlight: { bottom: 18, left: 40, width: 60, height: 60 }, highlightedComponent: { type: 'image', source: folderIcon, style: { width: 28, height: 28 } } },
    { icon: 'home-outline', title: 'Home', text: 'Discover And Swipe Through The Latest Opportunities.', modalPosition: { bottom: 130, alignSelf: 'center' }, arrowStyle: { bottom: -30, alignSelf: 'center', transform: [{ rotate: '90deg' }], marginLeft: -35.5 }, spotlight: { bottom: 18, alignSelf: 'center', width: 60, height: 60, marginLeft: -30 }, highlightedComponent: { type: 'image', source: homeIcon, style: { width: 28, height: 28 } } },
    { icon: 'bookmark-outline', title: 'Saved Internships', text: 'All Swipe-Rights Land Here! Review And Apply Anytime.', modalPosition: { bottom: 130, right: 25 }, arrowStyle: { bottom: -30, right: 20, transform: [{ rotate: '90deg' }] }, spotlight: { bottom: 18, right: 40, width: 60, height: 60 }, highlightedComponent: { type: 'image', source: bookmarkIcon, style: { width: 28, height: 28 } } },
];

