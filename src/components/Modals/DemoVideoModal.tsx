import { useEffect, useRef } from "react";
import { Dialog, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  FACTORLINK_DEMO_VIDEO_URL,
  getYoutubeEmbedUrl,
} from "../../config/demoVideo";

interface DemoVideoModalProps {
  open: boolean;
  onClose: () => void;
}

const DemoVideoModal = ({ open, onClose }: DemoVideoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const youtubeEmbedUrl = FACTORLINK_DEMO_VIDEO_URL
    ? getYoutubeEmbedUrl(FACTORLINK_DEMO_VIDEO_URL, { autoplay: true })
    : null;

  useEffect(() => {
    if (!open) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      return;
    }

    const video = videoRef.current;
    if (video) {
      void video.play().catch(() => {
        // Browser may block autoplay without mute; user can press play.
      });
    }
  }, [open]);

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: "var(--color-bg-neutral-primary, #0d0d0d)",
          m: 0,
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        aria-label="Cerrar video"
        sx={{
          position: "absolute",
          top: { xs: 8, sm: 16 },
          right: { xs: 8, sm: 16 },
          zIndex: 2,
          color: "common.white",
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.65)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          p: { xs: 2, sm: 4 },
          boxSizing: "border-box",
        }}
      >
        {!FACTORLINK_DEMO_VIDEO_URL ? (
          <Typography
            sx={{
              color: "common.white",
              textAlign: "center",
              px: 2,
            }}
          >
            Video demostrativo no configurado. Define VITE_DEMO_VIDEO_URL.
          </Typography>
        ) : youtubeEmbedUrl ? (
          open ? (
            <Box
              sx={{
                width: "100%",
                maxWidth: 1200,
                aspectRatio: "16 / 9",
                maxHeight: "100%",
                borderRadius: { xs: 0, sm: "var(--radius-m)" },
                overflow: "hidden",
                bgcolor: "common.black",
              }}
            >
              <Box
                component="iframe"
                src={youtubeEmbedUrl}
                title="Video demostrativo Factorlink"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                sx={{
                  width: "100%",
                  height: "100%",
                  border: 0,
                  display: "block",
                }}
              />
            </Box>
          ) : null
        ) : (
          <Box
            component="video"
            ref={videoRef}
            src={FACTORLINK_DEMO_VIDEO_URL}
            controls
            autoPlay
            playsInline
            preload="metadata"
            sx={{
              width: "100%",
              maxWidth: 1200,
              maxHeight: "100%",
              height: "auto",
              objectFit: "contain",
              borderRadius: { xs: 0, sm: "var(--radius-m)" },
              outline: "none",
            }}
          />
        )}
      </Box>
    </Dialog>
  );
};

export default DemoVideoModal;
