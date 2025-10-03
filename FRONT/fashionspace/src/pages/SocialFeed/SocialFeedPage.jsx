import SocialFeed from '../../components/SocialFeed/SocialFeed';
import './SocialFeedPage.css';

const SocialFeedPage = ({ user }) => {
  return (
    <div className="social-feed-page">
      <SocialFeed user={user} />
    </div>
  );
};

export default SocialFeedPage;