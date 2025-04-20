import React from 'react';
import { AdvancedVideo } from '@cloudinary/react';
import cld from '../config/cloudinary';

interface CloudinaryVideoProps {
  publicId: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  onEnded?: () => void;
}

const CloudinaryVideo: React.FC<CloudinaryVideoProps> = ({
  publicId,
  className,
  controls = false,
  autoPlay = false,
  loop = false,
  muted = false,
  onEnded
}) => {
  return (
    <AdvancedVideo
      cldVid={cld.video(publicId)}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      onEnded={onEnded}
      plugins={[]}
    />
  );
};

export default CloudinaryVideo; 