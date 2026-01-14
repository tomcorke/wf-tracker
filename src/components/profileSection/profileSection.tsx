import { Suspense, use, useMemo } from "react";
import STYLES from "./profileSection.module.css";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Section } from "../section";

type ProfileData = {};

const accountIdPattern = /^[a-f0-9]{24}$/;
const getProfileDataUrl = (accountId: string) => "";
// `http://localhost:8080/https://content.warframe.com/dynamic/getProfileViewingData.php?playerId=${accountId}`;

let profileDataPromise: Promise<ProfileData | null> | null = null;

type ProfileDataStore = {
  accountId: string;
  setAccountId: (newAccountId: string) => void;
  refreshData: () => void;
  getProfileData: () => Promise<ProfileData | null>;
};

export const useDataStore = create<ProfileDataStore>()(
  persist(
    (set, get) => ({
      accountId: get()?.accountId || "",
      setAccountId: (newAccountId: string) => set({ accountId: newAccountId }),
      refreshData: () => {
        profileDataPromise = null;
      },
      getProfileData: async () => {
        const accountId = get()?.accountId || "";

        if (!accountIdPattern.test(accountId)) return null;

        if (profileDataPromise) {
          return profileDataPromise;
        }

        profileDataPromise = new Promise(async (resolve) => {
          try {
            const response = await fetch(getProfileDataUrl(accountId));
            const json = await response.json();
            resolve(json as ProfileData);
          } catch (e) {
            console.error(e);
            resolve(null);
          }
        });

        return profileDataPromise;
      },
    }),
    { name: "wf-profile-data" }
  )
);

const ProfileDisplay = ({
  pendingData,
}: {
  pendingData: Promise<ProfileData | null>;
}) => {
  const data = use(pendingData);

  if (!data) {
    return <div>No profile data found.</div>;
  }

  return <div>Profile Data Loaded</div>;
};

export const ProfileSection = () => {
  const { accountId, setAccountId, refreshData, getProfileData } =
    useDataStore();

  const profileData = useMemo(() => getProfileData(), [accountId]);

  const isValidAccountIdFormat = accountIdPattern.test(accountId);

  return (
    <Section title="Profile">
      <input
        type="text"
        className={STYLES.accountIdInput}
        placeholder="Warframe Account ID..."
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
      />
      {isValidAccountIdFormat ? (
        <span className={STYLES.valid}>Account ID format looks correct!</span>
      ) : (
        <span className={STYLES.invalid}>Invalid Account ID format</span>
      )}
      <button disabled={!isValidAccountIdFormat} onClick={refreshData}>
        Fetch Profile Data
      </button>
      {isValidAccountIdFormat ? (
        <Suspense fallback={<div>Loading profile data...</div>}>
          <ProfileDisplay pendingData={profileData} />
        </Suspense>
      ) : null}
      <span>
        <a href={getProfileDataUrl(accountId)} target="_blank" rel="noreferrer">
          View Raw Profile Data
        </a>
      </span>
    </Section>
  );
};
