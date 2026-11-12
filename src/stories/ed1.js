/* Evenings in the ED. Stories for Rosalind, Joan (Gerald's wife), Alicia, Kenji and Harold. ED stays are short,
   so each arc is two beats. */
(function (S) {
  S.story.add('ed-podb-1', {
    '21': {
      idle: ['ros_after'], after: ['ros_talk'],
      gate: (s, P) => P.isch < .35 && !P.gone,
      guarded: [`"Not now, hon. I'm trying not to throw up."`, `She waves you off and closes her eyes.`],
      presence: `You stand by the stretcher a minute and watch the monitor with her. "Is that line supposed to wiggle like that?" "Yes," you say. She seems relieved.`,
      beats: [
        { need: 0, learn: `She's been tired for two weeks and blamed it on getting older.`,
          text: `"I've been tired for two weeks. Couldn't finish my walk Sunday. I figured that's sixty-four for you."`,
          choices: [
            { label: `New tiredness and not being able to walk your usual distance can be your heart, especially with diabetes. That's important. I'm telling the doctor.`, rap: 1, reply: `"Huh." She looks at the monitor differently. "Nobody ever told me that."` },
            { label: `Sixty-four isn't old.`, rap: 0, reply: `"Tell that to my knees."` },
            { label: `It\'s probably just age catching up. Most people slow down in their sixties, and a little tiredness is nothing to be embarrassed about. Let\'s see what the tests say.`, rap: -1, reply: `"That's what I said." She closes her eyes.` },
          ] },
        { need: 1, learn: `She quit smoking twice before and wants to try again.`,
          text: `"Bev's going to make me quit smoking now. I quit twice already. Never stuck."`,
          choices: [
            { label: `Most people take several tries. There's medicine and coaching that make it more likely to stick. Want me to put in for a referral?`, rap: 1, set: { quit: true }, reply: `"Third time's the charm." She holds out her pinky. "Don't tell Bev I said yes so fast."` },
            { label: `You really should.`, rap: 0, reply: `"I know."` },
          ] },
      ],
      epi: {
        close: (s, P) => `Rosalind went home on day three with a stent in her right coronary artery. ${P.quit ? 'She quit smoking with the program you referred her to and was still off cigarettes at her six-month visit. ' : ''}Bev walks with her every morning now.`,
        warm: `Rosalind went home on day three. She tells everyone at the laundry's retirement lunch that it "wasn't the chili."`,
        distant: `Rosalind Hughes was discharged on day three after a right coronary stent.`,
        hard: `Rosalind survived her arrest. She doesn't remember the ED. Bev does.`,
      },
    },
    '22': {
      who: 'joan', watch: true, idle: ['walt_talk', 'joan_after'], after: ['joan_talk'],
      gate: (s, P) => P.lkw,
      guarded: [`Joan is holding his hand and doesn't look up. "In a minute."`, `"Can we talk after? I'm watching him."`],
      presence: `You sit with Joan for a minute. Gerald squeezes her hand twice, then once. She laughs. "That means 'I'm fine.' He made it up just now."`,
      beats: [
        { need: 0, learn: `Joan left him alone for three and a half hours and blames herself.`,
          text: `"I left him alone. Three and a half hours. If I'd come home earlier..." She can't finish.`,
          choices: [
            { label: `You couldn't have known. And what you told me about eleven o'clock changed his treatment. You helped him today.`, rap: 1, reply: `She looks up. "I did?" She takes a breath. "Okay. Okay."` },
            { label: `Strokes happen. It's no one's fault.`, rap: 0, reply: `"I know." She doesn't sound like she does.` },
          ] },
        { need: 1, learn: `He proposed with a trumpet solo; she brought the trumpet.`,
          text: `"I brought his trumpet. Isn't that silly? I didn't know what else to grab."`,
          choices: [
            { label: `Not silly at all. When he's ready for therapy, music can help with speech. Bring it to rehab.`, rap: 1, reply: `"He'd like that." She sets it at the foot of the stretcher where he can see it.` },
            { label: `You can leave it at the desk if you want.`, rap: -1, reply: `"No. I'll keep it."` },
          ] },
      ],
      epi: {
        close: `Gerald's clot came out in one pass. Two weeks later he said "Joan" clearly for the first time since the stroke. By summer he played the first four bars of "Amazing Grace" at church. Joan cried through all four.`,
        warm: `Gerald went to inpatient rehab after a week. His right arm came back; his words are coming back slower.`,
        distant: `Gerald Haskins, thrombectomy for a left M1 occlusion, discharged to rehab.`,
        hard: `Gerald survived the hemorrhage but never regained his speech. Joan still brings the trumpet case to his room, and he still taps it.`,
      },
    },
    '23': {
      idle: ['ali_after'], after: ['ali_talk', 'ali_private'],
      gate: (s, P) => P.called !== null && P.private,
      guarded: [`She glances at the curtain. "Not now."`, `"I'm okay. Really."`],
      presence: `You stay a minute after checking her IV. She reaches for your hand and holds it, briefly, before letting go.`,
      beats: [
        { need: 0, learn: `She wanted this pregnancy, even though it wasn't planned.`,
          text: `"Is the baby... can they save it?" Her voice is small. "I didn't plan it, but I wanted it."`,
          choices: [
            { label: `I'm so sorry. A pregnancy in the tube can't grow into a baby, and it's bleeding. They need to stop it to keep you safe. It's okay to grieve this.`, rap: 1, reply: `She cries quietly. "Okay. Thank you for telling me straight."` },
            { label: `You're young. You'll have other chances.`, rap: -1, reply: `She turns her face away.` },
          ] },
        { need: 1, learn: `Her mother and sisters live twenty minutes away; she wants them, not Derek.`,
          text: `"Can you call my mom? Not Derek. My mom." She gives you the number from memory.`,
          choices: [
            { label: `Yes. I'll call her now and tell her where you'll be.`, rap: 1, set: { mom: true }, reply: `Her mother answers on the first ring. "I'm on my way."` },
            { label: `You can call her after surgery.`, rap: -1, reply: `She nods and says nothing.` },
          ] },
      ],
      epi: {
        close: (s, P) => `Alicia went home on day one to her mother's house, not Derek's. ${P.mom ? 'Her mom met her at the OR doors. ' : ''}She met with the advocate twice. She sent a card to the ED that just said "Thank you for asking."`,
        warm: `Alicia recovered from surgery and went home the next day with her sister.`,
        distant: `Alicia Moreno, laparoscopic salpingectomy, discharged postoperative day one.`,
        hard: `Alicia needed three units of blood. She lived. She doesn't remember most of the ED; she remembers that nobody asked her anything.`,
      },
    },
    '24': {
      idle: ['ken_after'], after: ['ken_talk', 'ken_leave'],
      gate: (s, P) => P.sev < .3 && !P.ivEpiEver,
      guarded: [`"Can we talk later? I'm texting my mom."`, `He's asleep. The Benadryl caught up with him.`],
      presence: `You check his monitor and stay a minute. He shows you the dorm group chat, which is entirely about him.`,
      beats: [
        { need: 0, learn: `He's embarrassed to use his EpiPen in front of people.`,
          text: `"Honestly? I don't carry it because it's embarrassing. Like, pulling out a giant needle at dinner."`,
          choices: [
            { label: `I hear that. But today it's the difference between a scary afternoon and a breathing tube. Your friends can learn to use it too, so it's not all on you.`, rap: 1, set: { friends: true }, reply: `"My roommate would think it's cool, actually." He laughs. "He'd want to do it."` },
            { label: `That's a dangerous choice.`, rap: -1, reply: `"Yeah, yeah."` },
          ] },
        { need: 1, learn: `He's a chemistry major and wants to understand how epinephrine works.`,
          text: `"So how does epinephrine actually fix it? I'm a chem major. Tell me the mechanism."`,
          choices: [
            { label: `It's an alpha and beta agonist. Alpha tightens the leaky blood vessels and brings your pressure up; beta-2 opens your airways and calms the mast cells. That's why antihistamines alone aren't enough.`, rap: 1, reply: `"Alpha up, beta open." He writes it on his hand. "That's going in my lab report somehow."` },
            { label: `It's adrenaline.`, rap: 0, reply: `"I know that part."` },
          ] },
      ],
      epi: {
        close: (s, P) => `Kenji left at 22:30 with two autoinjectors. ${P.friends ? 'His roommate learned to use them that night and practices on an orange.' : ''} He got an A on the lab report.`,
        warm: `Kenji went home that night with a new autoinjector and an allergist appointment.`,
        distant: `Kenji Watanabe, anaphylaxis, treated and observed.`,
        hard: (s, P) => (P.icu ? `Kenji was extubated the next day. He carries two autoinjectors now and checks the dates.` : `Kenji spent the night on a monitor after the IV epinephrine. His troponin came down by morning.`),
      },
    },
    '25': {
      idle: ['har_after', 'karen_after'], after: ['har_talk'],
      gate: (s, P) => P.bleed < .4 || P.pcc !== null,
      guarded: [`"Let an old man rest a minute."`, `He's dozing. Karen holds a finger to her lips.`],
      presence: `You sit with Harold and Karen. He tells you about the engine room on the USS Ranger. Karen has heard it a hundred times and laughs at the right part anyway.`,
      beats: [
        { need: 0, learn: `He lives alone and won't use his walker because it "makes him old."`,
          text: `"Karen wants me to use the walker. I'm not using a walker. Walkers are for old people."`,
          choices: [
            { label: `I get that. But you're on a blood thinner, so a fall is more dangerous for you than for most people. Would you try it on the steps, at least?`, rap: 1, set: { walker: true }, reply: `"The steps." He grumbles. "Fine. Just the steps."` },
            { label: `You need to use it.`, rap: -1, reply: `"I don't need to do anything."` },
          ] },
        { need: 1, learn: `His dog Duke is alone at home.`,
          text: `"Who's going to feed Duke?"`,
          choices: [
            { label: `Karen, could you swing by tonight? He'll rest better knowing.`, rap: 1, reply: `Karen nods. Harold relaxes into the pillow. "Two scoops. He'll tell you it's three."` },
            { label: `Don't worry about the dog.`, rap: -1, reply: `He worries about the dog.` },
          ] },
      ],
      epi: {
        close: (s, P) => `Harold's subdural didn't grow after reversal. He went home after four days with his anticoagulant changed. ${P.walker ? 'He uses the walker on the back steps, and only there, he says.' : ''}`,
        warm: `Harold went home on day four. Duke nearly knocked him over.`,
        distant: `Harold Jensen, subdural hematoma, warfarin reversed, discharged day four.`,
        hard: `Harold survived the craniotomy and went to a nursing home for rehab. Karen brings Duke to visit on Sundays.`,
      },
    },
  });
})(window.Shift);
