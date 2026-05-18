// App — design canvas with all trainee screens
function App() {
  return (
    <DesignCanvas>
      <DCSection id="trainee" title="NextFit · מסע המתאמן" subtitle="עיצוב מחדש · 390×844 · RTL · Dark + Red">
        <DCArtboard id="splash" label="00 · פתיחה · אנימציה" width={402} height={874}>
          <IOSDevice width={402} height={874} dark>
            <SplashScreen />
          </IOSDevice>
        </DCArtboard>
        <DCArtboard id="welcome" label="01 · ברוכים הבאים" width={402} height={874}>
          <IOSDevice width={402} height={874} dark>
            <A_Welcome />
          </IOSDevice>
        </DCArtboard>
        <DCArtboard id="login" label="02 · כניסת מאמן" width={402} height={874}>
          <IOSDevice width={402} height={874} dark>
            <A_Login />
          </IOSDevice>
        </DCArtboard>
        <DCArtboard id="signup" label="03 · הרשמת מאמן" width={402} height={874}>
          <IOSDevice width={402} height={874} dark>
            <A_Signup />
          </IOSDevice>
        </DCArtboard>
        <DCArtboard id="forgot" label="04 · שכחתי סיסמה" width={402} height={874}>
          <IOSDevice width={402} height={874} dark>
            <A_Forgot />
          </IOSDevice>
        </DCArtboard>
        <DCArtboard id="join" label="05 · קוד הצטרפות (מתאמן)" width={402} height={874}>
          <IOSDevice width={402} height={874} dark>
            <A_JoinCode />
          </IOSDevice>
        </DCArtboard>
        <DCArtboard id="home" label="06 · בית" width={402} height={874}>
          <IOSDevice width={402} height={874} dark>
            <HomeScreenDark />
          </IOSDevice>
        </DCArtboard>
        <DCArtboard id="workout" label="07 · אימון · שבוע" width={402} height={874}>
          <IOSDevice width={402} height={874} dark>
            <WorkoutScreen />
          </IOSDevice>
        </DCArtboard>
        <DCArtboard id="nutrition" label="08 · תזונה" width={402} height={874}>
          <IOSDevice width={402} height={874} dark>
            <NutritionScreen />
          </IOSDevice>
        </DCArtboard>
        <DCArtboard id="progress" label="09 · התקדמות" width={402} height={874}>
          <IOSDevice width={402} height={874} dark>
            <ProgressScreen />
          </IOSDevice>
        </DCArtboard>
        <DCArtboard id="home-light" label="A · בית · גרסה בהירה (השוואה)" width={402} height={874}>
          <IOSDevice width={402} height={874}>
            <HomeScreen />
          </IOSDevice>
        </DCArtboard>
        <DCArtboard id="tokens" label="System · מערכת ויזואלית" width={420} height={874}>
          <SystemTokens />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
