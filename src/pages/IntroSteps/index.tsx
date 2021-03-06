import React, { useEffect, useState } from "react";

import Welcome from "./Welcome";
import Introduction from "./Introduction";
import TermsAndConditions from "./TermsAndConditions";
import ImportWallet from "./ImportWallet";
import CreateWallet from "./CreateWallet";
import Layout from "../../components/Layout";
import ExistingWallet from "./ExistingWallet";
import SocialLogin from "./SocialLogin";

import { useAppContext } from "../../components/AppContext";

import styles from "./IntroSteps.module.scss";

const steps = {
  socialLogin: {
    id: "socialLogin",
    component: SocialLogin,
  },
  welcome: {
    id: "welcome",
    breadCrumb: "",
    component: Welcome,
  },
  intro: {
    id: "intro",
    component: Introduction,
  },
  termsAndConditions: {
    id: "termsAndConditions",
    component: TermsAndConditions,
  },
  importWallet: {
    id: "importWallet",
    component: ImportWallet,
  },
  createWallet: {
    id: "createWallet",
    component: CreateWallet,
  },
  existingWallet: {
    id: "existingWallet",
    component: ExistingWallet,
  },
};

export interface StepProps {
  setCurrentStep: (id: string) => void;
}

function IntroSteps() {
  const { isAlreadyUser, isLoggedIn } = useAppContext();
  const [currentStep, setCurrentStep] = useState(
    isLoggedIn
      ? isAlreadyUser
        ? steps.existingWallet.id
        : steps.welcome.id
      : steps.socialLogin.id
  );

  useEffect(() => {
    if (isAlreadyUser) {
      setCurrentStep(steps.existingWallet.id);
    }
  }, [isAlreadyUser]);

  const Component = steps[currentStep].component;

  return (
    <Layout>
      <div className={styles.Container}>
        <Component setCurrentStep={(id: string) => setCurrentStep(id)} />
      </div>
    </Layout>
  );
}

export default IntroSteps;
