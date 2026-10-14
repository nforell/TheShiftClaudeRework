/* Days on 6 East. Stories for Gloria, Raymond, Dolores and Theodore. */
(function (S) {
  S.story.add('stepdown-6e-1', {
    '601': {
      idle: ['glo_after'], after: ['glo_talk'],
      gate: (s, P) => !P.diltOn && P.hf < .8,
      guarded: [`"Can we talk later, dear? I'm trying to catch my breath."`, `She's holding the book closed on her finger. "Not now. I'm counting my heartbeats."`],
      presence: `You sit by the window while the amiodarone runs. She opens her book and reads you a paragraph about a lighthouse in a storm, then closes it. "That's enough excitement for one morning."`,
      beats: [
        { need: 0, learn: `Her husband Ernesto died of a heart attack eight years ago.`,
          text: `"Ernesto, my husband, his heart just stopped. In the garden, eight years ago. I found him with the hose still running." She smooths the blanket. "So when mine does this, I think: here it comes."`,
          choices: [
            { label: `No wonder this is so frightening. Your heart is different from his: it's beating fast and irregularly, not stopping, and we can slow it. What do you most want to know?`, rap: 1, reply: `"Whether I'll see Rafael get married in June." She laughs a little. "That's not a medical question, is it." "It's a fair one," you say.` },
            { label: `That was a long time ago. Try not to think about it.`, rap: -1, reply: `"I'll try." She doesn't.` },
            { label: `I'm sorry. That must have been awful.`, rap: 0, reply: `"It was." She nods, and goes quiet.` },
          ] },
        { need: 1, learn: `She'd been sleeping in her recliner for weeks and told no one.`,
          text: `"I'll confess something. I haven't slept in a bed for a month. I told my son it was my back." She looks embarrassed. "I couldn't breathe lying down. I thought it was age."`,
          choices: [
            { label: `That's important, and you're not the first to blame age. Not being able to lie flat is a sign of fluid on the lungs. When you go home, that's something to call about right away.`, rap: 1, set: { taught: true },
              judge: [`comm`, 1, `You taught Mrs. Mendes a heart failure warning sign.`, `Orthopnea is one of the earliest signs that fluid is building. Patients who know it call sooner, and come back to the hospital less.`],
              reply: `"Can't lie flat, call the doctor." She writes it inside the cover of her book. "I'm putting it where I'll see it."` },
            { label: `You should have told someone.`, rap: -1, reply: `"I know that now." She closes the book.` },
          ] },
        { need: 2, learn: `Her son Rafael is getting married in June. She's reading the book club's lighthouse novel.`,
          text: `"Rafael is getting married in June. In Monterey. There's a lighthouse." She holds up the book. "That's why the Thursday ladies picked this one. They're terrible at subtlety."`,
          choices: [
            { label: `Then let's get you strong enough to walk to that lighthouse.`, rap: 1, reply: `"With a cane, if I have to." She smiles properly for the first time today. "I'll be the one in blue."` },
            { label: `That's lovely.`, rap: 1, reply: `"It is." She looks at the cover a while.` },
          ] },
      ],
      epi: {
        close: (s, P) => `Gloria went home on day six on amiodarone, an anticoagulant and a heart failure regimen. ${P.taught ? 'The note inside her book cover said "Can\'t lie flat, call the doctor," and in April she did, and was home the same day.' : ''} In June she walked to the Monterey lighthouse with a cane, in blue.`,
        warm: `Gloria went home after a week. Her EF was 35% at her three-month echo. The Thursday ladies finished the lighthouse book without her and told her the ending, which she says was rude of them.`,
        distant: `Gloria Mendes was discharged on day six. Her chart says "rate controlled, euvolemic." It doesn't say anything about June.`,
        hard: (s, P) => (P.icu ? `Gloria spent two days in the CCU on BiPAP. She told her son on the phone that she'd been "a bit short of breath." He drove down from Sacramento anyway.` : `Gloria was still on diltiazem at noon. The afternoon nurse found her short of breath at two.`),
      },
    },
    '603': {
      idle: ['ray_after'], after: ['ray_talk'],
      gate: (s, P) => P.bleed < .3 || P.called !== null,
      guarded: [`"I'm not much for talking flat on my back."`, `He's staring at the ceiling tiles, counting. "Thirty-two. Ask me later."`],
      presence: `You stand by the bed a minute without a task. He tells you the stops on the 51, in order, all forty of them. It takes a while. You let it.`,
      beats: [
        { need: 0, learn: `Drives the 51 bus; 26 years without missing a shift until this one.`,
          text: `"Twenty-six years on the 51 and I never called in sick. Not once. Today the dispatcher's going to call my name and I'm going to be lying here with a jug." He shakes his head. "Somebody else is driving my route."`,
          choices: [
            { label: `Twenty-six years without a sick day. What's it like, being the person everyone counts on?`, rap: 1, reply: `He thinks about it. "Heavy, sometimes. Good, mostly." A pause. "Nobody counts on you if you're dead, I guess. So I'll lie here."` },
            { label: `The bus will be fine without you for a week.`, rap: 0, reply: `"That's what worries me." He almost smiles.` },
          ] },
        { need: 1, learn: `He had chest pressure for two days and drove his route anyway.`,
          text: `"I'll tell you something I didn't tell the doctors. My chest felt tight Tuesday and Wednesday. I thought it was heartburn. I drove anyway." He looks at you sideways. "Adaeze doesn't know."`,
          choices: [
            { label: `Thank you for telling me. Two days of pressure before the big one is common, and it's worth the team knowing. Next time, chest pressure means stop the bus and call 911. Would you tell Adaeze, or want help telling her?`, rap: 1, set: { warned: true },
              judge: [`comm`, 1, `You taught Mr. Okoro to act on warning symptoms.`, `Many heart attacks have days of warning. Patients who learn to act on them, and families who know, get to the hospital sooner next time.`],
              reply: `"I'll tell her." He rubs his face. "She'll kill me. But I'll tell her."` },
            { label: `That was a dangerous choice.`, rap: -1, reply: `"I know that now." He looks back at the ceiling.` },
          ] },
        { need: 2, learn: `Coaches his granddaughter Chioma's under-10 soccer team.`,
          text: `"Saturday my granddaughter's team plays the Blue Hornets. Chioma. She's nine, plays goalie. Fearless." He grins. "I'm the coach. Who's going to yell 'positions' if I'm not there?"`,
          choices: [
            { label: `What would it take to be on the sideline, sitting in a chair, yelling "positions"?`, rap: 1, reply: `"A chair, and Adaeze's permission." He laughs, then winces. "And yours, apparently. When can I bend my leg?"` },
            { label: `You'll be back on the field in no time.`, rap: 0, reply: `"From your lips." He doesn't sound convinced.` },
          ] },
      ],
      epi: {
        close: (s, P) => `Raymond went home on day three. ${P.warned ? 'He told Adaeze about Tuesday and Wednesday. She did not, in fact, kill him.' : ''} He watched Chioma's game from a folding chair on Saturday and yelled "positions" until the referee asked him to stop. He was back on the 51 in six weeks.`,
        warm: `Raymond went home on day three, grumbling about cardiac rehab and then going to every session. He's back on the 51.`,
        distant: `Raymond Okoro was discharged after his stent. His chart lists his medications. It doesn't mention Chioma.`,
        hard: (s, P) => (P.icu ? `Raymond needed three units of blood and a covered stent. He missed Chioma's game; Adaeze filmed it for him.` : `Raymond's bleed was found by the afternoon nurse. He went to CT at one.`),
      },
    },
    '605': {
      idle: ['dol_after'], after: ['dol_talk'],
      gate: (s, P) => P.foot < .5,
      guarded: [`"I'm in the middle of 22 down, dear."`, `She holds up a finger without looking up from the crossword.`],
      presence: `You sit with her for a minute. She hands you the crossword without a word and points at 9 across. You get it. She looks impressed, then annoyed.`,
      beats: [
        { need: 0, learn: `Taught high-school chemistry for 31 years.`,
          text: `"Thirty-one years of sophomores and their Bunsen burners. I lost two eyebrows and zero students." She taps her pen. "I still read every lab sheet they hand me. Old habits."`,
          choices: [
            { label: `Then I want you on my team. If you ever see a number that worries you, tell me. You might catch something we miss.`, rap: 1, reply: `"I already did, didn't I." She looks pleased. "Platelets."` },
            { label: `You don't need to worry about the numbers.`, rap: -1, reply: `"I don't worry, dear. I read." She goes back to the crossword.` },
          ] },
        { need: 1, learn: `Lives alone; her neighbor Bernadette feeds her cat Mendeleev.`,
          text: `"My neighbor Bernadette is feeding Mendeleev. My cat. He's sixteen and judgmental." She sighs. "Bernadette calls me every evening to report on his bowel habits. In detail."`,
          choices: [
            { label: `A cat named Mendeleev. Who else checks on you at home, besides Bernadette?`, rap: 1, set: { asked: true },
              judge: [`comm`, 1, `You asked Mrs. Price about her support at home.`, `She lives alone and is going home on a new anticoagulant. Who checks on her matters for safe discharge.`],
              reply: `"My sister calls Sundays. That's it, really." She shrugs. "I manage." You make a note for case management.` },
            { label: `Cats are great company.`, rap: 0, reply: `"He's terrible company. That's why I like him."` },
          ] },
        { need: 2, learn: `Wants to see her sister in Portland again, the trip that led to the clot.`,
          text: `"I drove eleven hours to see my sister in Portland. That's how I got the clot, they tell me." She caps her pen. "I'd do it again. But I'd stop and walk."`,
          choices: [
            { label: `Every hour or two, out of the car, walk and flex your ankles, and keep drinking water. You can still go see her.`, rap: 1, reply: `"Every hour. Ankles. Water." She writes it in the crossword margin. "Edith will be thrilled. She thinks I'm a terrible driver anyway."` },
            { label: `Maybe fly next time.`, rap: 0, reply: `"Planes have clots too, dear."` },
          ] },
      ],
      epi: {
        close: (s, P) => `Dolores went home on apixaban once her platelets recovered, with heparin on her allergy list for life. ${P.asked ? 'Case management set up a daily phone check, which she calls "the warden."' : ''} In October she drove to Portland, stopping every hour to walk. Edith said she drove terribly.`,
        warm: `Dolores went home after nine days. Mendeleev ignored her for two days, then slept on her feet.`,
        distant: `Dolores Price was discharged on apixaban. Her chart says "HIT antibody positive." It doesn't say she noticed first.`,
        mixed: (s, P) => (P.stopped !== null ? `Dolores's heparin was off by noon, and nothing replaced it until the afternoon team ${P.called ? 'got the argatroban running' : 'heard about her platelets'}. She still had a clot in her lung. She went home on apixaban after twelve days, with heparin on her allergy list for life.` : `Dolores's heparin kept running at the right rate for the wrong reason. The afternoon nurse read her CBC and stopped it. She went home after two weeks, with heparin on her allergy list for life.`),
        hard: (s, P) => (P.gone ? `Dolores kept her foot after a thrombectomy. She asked the vascular surgeon why the heparin was still running with platelets of 98. He didn't have a good answer.` : `Dolores was still on heparin at noon. The afternoon nurse read her CBC.`),
      },
    },
    '607': {
      idle: ['theo_after'], after: ['theo_talk'],
      gate: (s, P) => !P.run || s.t - P.runAt > 30,
      guarded: [`"I'm resting my voice, dear. Doctor's orders. Not really."`, `He's humming something low with his eyes closed. He holds up a hand: wait.`],
      presence: `You stand at the window with him a minute. He hums the bass line of something you almost recognize. "Bach," he says. "Everybody's always waiting for the melody. The bass is what holds it up."`,
      beats: [
        { need: 0, learn: `Retired clock repairman. Sings bass in the church choir.`,
          text: `"Forty years repairing clocks. You learn to hear when something's a hair off. A skip in the tick." He taps his chest. "My heart's been doing that. A little flip. Like an escapement that catches."`,
          choices: [
            { label: `That's a good description. Those flips are extra beats, and they matter with your heart rhythm. Tell me right away if you feel one, or feel lightheaded.`, rap: 1, set: { tell: true }, reply: `"Skipped tick, ring the bell." He reaches for the call light and puts it in his shirt pocket. "There."` },
            { label: `Everybody gets a few extra beats.`, rap: 0, reply: `"I suppose." He hums, unconvinced.` },
          ] },
        { need: 1, learn: `Started taking two citalopram tablets because Ingrid said he was grumpy.`,
          text: `"Ingrid's been worried about me since my brother died in the spring. I got short with people. So I started taking two of my pills instead of one." He looks at you over his glasses. "That was wrong, wasn't it."`,
          choices: [
            { label: `It's an easy thing to do when you're hurting, and I'm glad you told me. The higher dose can affect your heart rhythm at your age. Let's talk with your doctor about the dose, and about how you've been feeling since your brother died.`, rap: 1, set: { grief: true },
              judge: [`comm`, 1, `You addressed both the double dose and the grief behind it.`, `The medication change is a safety issue; the reason he made it is a care need. Both go to the team.`],
              reply: `"Erik. He was the tenor." He's quiet. "I'd like that. Talking about it."` },
            { label: `Yes, never change your dose without asking.`, rap: 0, reply: `"Yes, nurse." He looks chastened.` },
          ] },
        { need: 2, learn: `Names his roses after composers.`,
          text: `"My roses are named after composers. Brahms blooms the most. Mahler sprawls everywhere. Bach is very orderly." He smiles. "Ingrid says I've lost my mind."`,
          choices: [
            { label: `Which one would you be?`, rap: 1, reply: `He thinks seriously. "Schubert. Wrote a lot, died young, liked his friends." A pause. "Well. Not the dying young part. Too late for that."` },
            { label: `That's funny.`, rap: 1, reply: `"Ingrid doesn't think so." He's delighted.` },
          ] },
      ],
      epi: {
        close: (s, P) => `Theo went home on day three on 10 mg of citalopram, with potassium and magnesium checked weekly. ${P.grief ? 'He started seeing a grief counselor about his brother Erik, and sang at the memorial in the fall.' : ''} Brahms put out forty-one blooms that summer.`,
        warm: `Theo went home with a lower dose, a heart monitor patch and orders not to double anything without asking. He's back in the choir.`,
        distant: `Theodore Lindqvist was discharged after a syncope workup. His chart says "QTc 468 at discharge." It doesn't say what he sings.`,
        hard: (s, P) => (P.icu ? `Theo spent three days in the CCU after torsades. He doesn't remember the code. Ingrid does.` : `Theo's QT was still over 500 at noon. The afternoon nurse started his electrolytes.`),
      },
    },
  });
})(window.Shift);
