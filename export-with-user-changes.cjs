const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

// 1. Read user changes
const userChangesPath = path.join(__dirname, 'user-changes.json');
if (!fs.existsSync(userChangesPath)) {
  console.error('user-changes.json not found!');
  process.exit(1);
}
const userChanges = JSON.parse(fs.readFileSync(userChangesPath, 'utf-8'));

// 2. Apply changes to codebase (example: update HomePage content, styles, etc.)
// You must write logic for each type of change you support
function applyUserChanges() {
  // Example: update HomePage content if present
  if (userChanges.homePageContent) {
    const homePagePath = path.join(__dirname, 'src/pages/HomePage.tsx');
    if (fs.existsSync(homePagePath)) {
      let content = fs.readFileSync(homePagePath, 'utf-8');
      // Replace the editableContent assignment (customize this regex as needed)
      content = content.replace(/const editableContent = .*?;/s, `const editableContent = ${JSON.stringify(userChanges.homePageContent)};`);
      fs.writeFileSync(homePagePath, content, 'utf-8');
      console.log('Patched HomePage.tsx with user changes.');
    }
  }

  // Patch InsightsPage articles
  if (userChanges.insightsPageArticles && userChanges.insightsPageArticles.articleContent) {
    const insightsPagePath = path.join(__dirname, 'src/pages/InsightsPage.tsx');
    if (fs.existsSync(insightsPagePath)) {
      let content = fs.readFileSync(insightsPagePath, 'utf-8');
      // Replace the articles array
      content = content.replace(
        /export const articles: Article\[\] = \[[\s\S]*?\];/,
        `export const articles: Article[] = ${JSON.stringify(Object.values(userChanges.insightsPageArticles.articleContent), null, 2)};`
      );
      fs.writeFileSync(insightsPagePath, content, 'utf-8');
      console.log('Patched InsightsPage.tsx articles.');
    }
  }

  // Patch LearningPage courses
  if (userChanges.learningPageContent && userChanges.learningPageContent.courseContent) {
    const learningPagePath = path.join(__dirname, 'src/pages/LearningPage.tsx');
    if (fs.existsSync(learningPagePath)) {
      let content = fs.readFileSync(learningPagePath, 'utf-8');
      // Replace the courses array
      content = content.replace(
        /export const courses: Course\[\] = \[[\s\S]*?\];/,
        `export const courses: Course[] = ${JSON.stringify(Object.values(userChanges.learningPageContent.courseContent), null, 2)};`
      );
      fs.writeFileSync(learningPagePath, content, 'utf-8');
      console.log('Patched LearningPage.tsx courses.');
    }
  }

  // Patch MentorshipPage mentors
  if (userChanges.mentorshipPageMentors) {
    const mentorshipPagePath = path.join(__dirname, 'src/pages/MentorshipPage.tsx');
    if (fs.existsSync(mentorshipPagePath)) {
      let content = fs.readFileSync(mentorshipPagePath, 'utf-8');
      // Replace the mentors array
      content = content.replace(
        /export const mentors: Mentor\[\] = \[[\s\S]*?\];/,
        `export const mentors: Mentor[] = ${JSON.stringify(userChanges.mentorshipPageMentors, null, 2)};`
      );
      fs.writeFileSync(mentorshipPagePath, content, 'utf-8');
      console.log('Patched MentorshipPage.tsx mentors.');
    }
  }

  // Patch OpportunitiesPage opportunities
  if (userChanges.opportunitiesPageOpportunities) {
    const opportunitiesPagePath = path.join(__dirname, 'src/pages/OpportunitiesPage.tsx');
    if (fs.existsSync(opportunitiesPagePath)) {
      let content = fs.readFileSync(opportunitiesPagePath, 'utf-8');
      // Replace the opportunities array
      content = content.replace(
        /export const opportunities: Opportunity\[\] = \[[\s\S]*?\];/,
        `export const opportunities: Opportunity[] = ${JSON.stringify(userChanges.opportunitiesPageOpportunities, null, 2)};`
      );
      fs.writeFileSync(opportunitiesPagePath, content, 'utf-8');
      console.log('Patched OpportunitiesPage.tsx opportunities.');
    }
  }

  // Patch EventsPage events
  if (userChanges.eventPageEvents) {
    const eventsPagePath = path.join(__dirname, 'src/pages/EventsPage.tsx');
    if (fs.existsSync(eventsPagePath)) {
      let content = fs.readFileSync(eventsPagePath, 'utf-8');
      // Replace the events array
      content = content.replace(
        /const events: Event\[\] = \[[\s\S]*?\];/,
        `const events: Event[] = ${JSON.stringify(userChanges.eventPageEvents, null, 2)};`
      );
      fs.writeFileSync(eventsPagePath, content, 'utf-8');
      console.log('Patched EventsPage.tsx events.');
    }
  }

  // Patch Leaderboard content
  if (userChanges.leaderboardContent) {
    const leaderboardPath = path.join(__dirname, 'src/components/Leaderboard.tsx');
    if (fs.existsSync(leaderboardPath)) {
      let content = fs.readFileSync(leaderboardPath, 'utf-8');
      // Replace the defaultLeaders array
      content = content.replace(
        /const defaultLeaders: Leader\[\] = \[[\s\S]*?\];/,
        `const defaultLeaders: Leader[] = ${JSON.stringify(userChanges.leaderboardContent, null, 2)};`
      );
      fs.writeFileSync(leaderboardPath, content, 'utf-8');
      console.log('Patched Leaderboard.tsx defaultLeaders.');
    }
  }

  // Patch text color styles for headings and paragraphs
  Object.entries(userChanges).forEach(([key, value]) => {
    const textColorMatch = key.match(/^textColor:(h[1-6]|p|span|div):hash(-?\d+)$/);
    if (textColorMatch) {
      const tag = textColorMatch[1];
      const hash = textColorMatch[2];
      // Patch all major page files
      const filesToPatch = [
        path.join(__dirname, 'src/pages/InsightsPage.tsx'),
        path.join(__dirname, 'src/pages/LearningPage.tsx'),
        path.join(__dirname, 'src/pages/MentorshipPage.tsx'),
        path.join(__dirname, 'src/pages/OpportunitiesPage.tsx'),
        path.join(__dirname, 'src/pages/EventsPage.tsx'),
      ];
      filesToPatch.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf-8');
          // Replace style={getPersistedTextStyle('tag', ...)} with style={{ color: '...' }}
          const regex = new RegExp(
            `<${tag}([^>]*)style=\\{getPersistedTextStyle\\('${tag}', [^\\)]*hash${hash}[^\\)]*\\)\\}([^>]*)>`,
            'g'
          );
          content = content.replace(
            regex,
            `<${tag}$1style={{ color: '${value}' }}$2>`
          );
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log(`Patched ${filePath} ${tag} color for hash${hash}.`);
        }
      });
    }
  });

  // Patch background color styles for headings, divs, etc.
  Object.entries(userChanges).forEach(([key, value]) => {
    const bgColorMatch = key.match(/^backgroundColor:(h[1-6]|p|span|div):hash(-?\d+)$/);
    if (bgColorMatch) {
      const tag = bgColorMatch[1];
      const hash = bgColorMatch[2];
      const filesToPatch = [
        path.join(__dirname, 'src/pages/InsightsPage.tsx'),
        path.join(__dirname, 'src/pages/LearningPage.tsx'),
        path.join(__dirname, 'src/pages/MentorshipPage.tsx'),
        path.join(__dirname, 'src/pages/OpportunitiesPage.tsx'),
        path.join(__dirname, 'src/pages/EventsPage.tsx'),
      ];
      filesToPatch.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf-8');
          // Replace style={getPersistedTextStyle('tag', ...)} with style={{ backgroundColor: '...' }}
          const regex = new RegExp(
            `<${tag}([^>]*)style=\\{getPersistedTextStyle\\('${tag}', [^\\)]*hash${hash}[^\\)]*\\)\\}([^>]*)>`,
            'g'
          );
          content = content.replace(
            regex,
            `<${tag}$1style={{ backgroundColor: '${value}' }}$2>`
          );
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log(`Patched ${filePath} ${tag} backgroundColor for hash${hash}.`);
        }
      });
    }
  });

  // Patch font size styles for headings, paragraphs, etc.
  Object.entries(userChanges).forEach(([key, value]) => {
    const fontSizeMatch = key.match(/^fontSize:(h[1-6]|p|span|div):hash(-?\d+)$/);
    if (fontSizeMatch) {
      const tag = fontSizeMatch[1];
      const hash = fontSizeMatch[2];
      const filesToPatch = [
        path.join(__dirname, 'src/pages/InsightsPage.tsx'),
        path.join(__dirname, 'src/pages/LearningPage.tsx'),
        path.join(__dirname, 'src/pages/MentorshipPage.tsx'),
        path.join(__dirname, 'src/pages/OpportunitiesPage.tsx'),
        path.join(__dirname, 'src/pages/EventsPage.tsx'),
      ];
      filesToPatch.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf-8');
          // Replace style={getPersistedTextStyle('tag', ...)} with style={{ fontSize: '...' }}
          const regex = new RegExp(
            `<${tag}([^>]*)style=\\{getPersistedTextStyle\\('${tag}', [^\\)]*hash${hash}[^\\)]*\\)\\}([^>]*)>`,
            'g'
          );
          content = content.replace(
            regex,
            `<${tag}$1style={{ fontSize: '${value}' }}$2>`
          );
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log(`Patched ${filePath} ${tag} fontSize for hash${hash}.`);
        }
      });
    }
  });

  // TODO: Add more patch logic for other pages, styles, etc. as needed
}

// 3. Zip the codebase
async function zipCodebase() {
  const zip = new JSZip();
  function addDirToZip(dir, zipFolder) {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      const relPath = path.relative(__dirname, fullPath);
      if (fs.statSync(fullPath).isDirectory()) {
        addDirToZip(fullPath, zipFolder.folder(file));
      } else {
        zipFolder.file(file, fs.readFileSync(fullPath));
      }
    });
  }
  // Add all files except node_modules and .git
  const skipDirs = ['node_modules', '.git', 'dist'];
  fs.readdirSync(__dirname).forEach(item => {
    if (skipDirs.includes(item)) return;
    const fullPath = path.join(__dirname, item);
    if (fs.statSync(fullPath).isDirectory()) {
      addDirToZip(fullPath, zip.folder(item));
    } else {
      zip.file(item, fs.readFileSync(fullPath));
    }
  });
  const content = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync('my-edited-site.zip', content);
  console.log('my-edited-site.zip created!');
}

applyUserChanges();
zipCodebase(); 