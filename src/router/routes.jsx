import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/Authentication/Login";
import AdminLogin from "../pages/Authentication/AdminLogin";
import RegisterPage from "../pages/Authentication/Register";
import { LoadingSpinner } from "../components/spinner/Spinner";
import PrivateRoute from "./privateRoutes";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

const HomePage = React.lazy(() => import("../pages/home/Home"));
const AboutPage = React.lazy(() => import("../pages/about/About"));
const ServicesPage = React.lazy(() => import("../pages/prices/Price"));
const GalleryPage = React.lazy(() => import("../pages/gallery/Gallery"));
const ContactPage = React.lazy(() => import("../pages/contact/Contact"));
const LocationPage = React.lazy(() => import("../pages/contact/Location"));

// Service pages with lazy loading
const WeddingPackages = React.lazy(() =>
  import("../pages/servicepages/Wedding")
);
const SpaServices = React.lazy(() => import("../pages/servicepages/Spa"));
const SkincareServices = React.lazy(() =>
  import("../pages/servicepages/SkinCare")
);
const NailCareServices = React.lazy(() =>
  import("../pages/servicepages/NailCare")
);
const BookingForm = React.lazy(() => import("../pages/booking/Booking"));
const HairCareServices = React.lazy(() =>
  import("../pages/servicepages/HairCare")
);
const HairRemovalServices = React.lazy(() =>
  import("../pages/servicepages/HairRemoval")
);
const EyelashServices = React.lazy(() =>
  import("../pages/servicepages/EyeLash")
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/location" element={<LocationPage />} />

        <Route
          path="/booking"
          element={
            <PrivateRoute>
              <BookingForm />
            </PrivateRoute>
          }
        />

        <Route path="/price" element={<ServicesPage />} />
        <Route path="/wedding" element={<WeddingPackages />} />
        <Route path="/spa" element={<SpaServices />} />
        <Route path="/skincare" element={<SkincareServices />} />
        <Route path="/haircare" element={<HairCareServices />} />
        <Route path="/hair-removal" element={<HairRemovalServices />} />
        <Route path="/eyelashes" element={<EyelashServices />} />
        <Route path="/nailcare" element={<NailCareServices />} />
      </Routes>
      <Footer />
    </Suspense>
  );
};

export default AppRoutes;
