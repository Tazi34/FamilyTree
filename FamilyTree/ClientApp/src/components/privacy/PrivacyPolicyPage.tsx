import { makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 1000,
    margin: "0 auto",

    padding: 50,
    minHeight: "100%",
  },
}));

const PrivacyPolicyPage = (props: any) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <h3>Privacy Notice (Updated 2020-12-23)</h3>
      <p></p>
      <p>
        In this Notice, Krzysztof Kicun and Paweł Kasjaniuk (&quot;us&quot; or
        &quot;we&quot; or &quot;our&quot;), provide you with information about
        how we process your personal data.&nbsp;
      </p>
      <p>
        <span lang="en-US">
          <strong>1.&nbsp;Who controls your personal data?</strong>
        </span>
      </p>
      <p>
        <span lang="en-US">
          We are the administrators of your personal data. We work together on
          graduate work, that is why we created this app and so to app can work
          properly, we have to keep some of your personal data.
        </span>
      </p>
      <p>
        <span lang="en-US">
          <strong>2. &nbsp;What personal data do we collect?</strong>
        </span>
      </p>
      <p>
        <span lang="en-US">
          We collect personal data that (a) you actively submit to us, and (b)
          we obtain from third parties. We may process your personal data with
          or without automatic means, including collection, recording,
          organization, structuring, storage, adaptation or alteration,
          retrieval, consultation, use, disclosure by transmission,
          dissemination or otherwise making available, alignment or combination,
          restriction, erasure, or destruction of your personal data.
        </span>
      </p>
      <ol type="a">
        <li>
          <p>
            <em>Actively submitted data</em>
            <span lang="en-US">. You submit personal data to us when you:</span>
          </p>
          <ul>
            <li>
              <p>
                <span lang="en-US">first time log into app</span>
              </p>
            </li>
            <li>
              <p>
                <span lang="en-US">change information on your profile</span>
              </p>
            </li>
            <li>
              <p>
                <span lang="en-US">
                  change information on your tree&rsquo;s node
                </span>
              </p>
            </li>
          </ul>
        </li>
        <li>
          <p>
            <em>Data we obtain from third parties&nbsp;</em>
            <span lang="en-US">
              when you log in with google or facebook. We collect only your
              email address from those websites.
            </span>
          </p>
        </li>
      </ol>

      <p>
        <span lang="en-US">
          <strong>
            3.&nbsp;For what purposes do we process personal data?
          </strong>
        </span>
      </p>
      <p>
        <span lang="en-US">
          We process personal data so as Family Tree app can work. We may use
          personal data to (b) create and maintain membership records, (c)
          fulfill requests you make, (e) customize features or content on our
          tools or services.
        </span>
      </p>
      <p>
        <span lang="en-US">
          <strong>4. With whom do we share personal data?</strong>
        </span>
      </p>
      <p>
        <span lang="en-US">
          We do not share your personal data with anybody. Some of them are
          available on your profile in Family Tree. Those are: your name,
          surname, gender, photo and date of birth.
        </span>
      </p>
      <p>
        <span lang="en-US">
          <strong>5.&nbsp;Where do we store personal data?</strong>
        </span>
      </p>
      <p>
        <span lang="en-US">
          We store personal data our secure online database.
        </span>
      </p>
      <p>
        <span lang="en-US">
          <strong>6.&nbsp;How do we secure personal data?</strong>
        </span>
      </p>
      <p>
        <span lang="en-US">
          We do not sell, share, or distribute any private or personal
          information to any third parties. We maintain a variety of procedural
          safeguards to protect your personal data including encryption.
        </span>
      </p>
      <p>
        <span lang="en-US">
          <strong>7.&nbsp;How long do we retain personal data?</strong>
        </span>
      </p>
      <p>
        <span lang="en-US">
          We retain personal data as long as Family Tree app works. We will
          delete your data, if you will ask administrator to do so. Contact us
          on family.trees.application@gmail.com
        </span>
      </p>
      <p>
        <span lang="en-US">
          <strong>
            8.&nbsp;How can you access, correct and delete your personal data?
          </strong>
        </span>
      </p>
      <p>
        You can access, correct and delete your personal data through Family
        Tree app. If you experience any problem with that, you can contact
        us.&nbsp;
      </p>
      <p>
        <span lang="en-US">
          <strong>9.&nbsp;Contact us.</strong>
        </span>
      </p>
      <p>
        <span lang="en-US">Email: family.trees.application@gmail.com</span>
      </p>
      <p></p>
    </Paper>
  );
};

export default PrivacyPolicyPage;
