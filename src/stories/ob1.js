/* Days on 2 North. Stories for Keisha, Lani, Linh (Baby Nguyen's mother) and Sarah. */
(function (S) {
  S.story.add('ob-2n-1', {
    '212': {
      idle: ['kei_after'], after: ['kei_talk'],
      gate: (s, P) => !P.bladder && P.tone < .55 && !P.bronch,
      guarded: [`"Can we talk later? I'm trying to get him to latch."`, `She's watching the baby sleep. "Shh. Five more minutes of this."`],
      presence: `You stand by the bassinet a minute without a task. The baby makes a small noise in his sleep and you both laugh at the same time.`,
      beats: [
        { need: 0, learn: `With her first birth, she told staff something felt wrong and was told she was being dramatic.`,
          text: `"Can I tell you something? With Nia, I kept saying something was wrong after she came out. They said I was being dramatic. Turned out I'd torn and nobody had checked." She looks at you. "So when you came in and actually looked, I almost cried."`,
          choices: [
            { label: `I'm sorry that happened. You know your body. If something feels wrong today, tell me, and I'll check, every time.`, rap: 1, reply: `"Every time. I'm holding you to that." She settles back. "Desmond's going to like you."` },
            { label: `That sounds frustrating. Things are different here, and I\'m sure it was a misunderstanding; nobody ignores a patient on purpose.`, rap: 0, reply: `"Hope so." She nods, unconvinced, but not unfriendly.` },
            { label: `I'm sure they had their reasons.`, rap: -1, reply: `"Sure." She turns to the baby.` },
          ] },
        { need: 1, learn: `She teaches seventh-grade math and plans to explain blood loss in grams to her class.`,
          text: `"So you weigh the pads? One gram is one milliliter?" She grins. "I teach seventh-grade math. I'm stealing that. Density of blood, that's a real-world problem."`,
          choices: [
            { label: `Steal it. And here's the part to teach them: we weigh because people guessing by eye miss half of the bleeding.`, rap: 1, reply: `"Measurement beats guessing. That's literally my whole curriculum." She writes it on the back of Nia's card.` },
            { label: `Ha. Math teachers.`, rap: 0, reply: `"Can't turn it off." She smiles.` },
          ] },
        { need: 2, learn: `The baby's real name is Jalen. Nia still calls him Pickle.`,
          text: `"His real name's Jalen. After my grandfather." She strokes his cheek. "But Nia's going to call him Pickle until he's forty, isn't she."`,
          choices: [
            { label: `Absolutely. And he'll pretend to hate it.`, rap: 1, reply: `She laughs. "Just like my brother. He's 'Peanut' to this day, and he's a firefighter."` },
            { label: `Jalen's a great name.`, rap: 1, reply: `"Thank you. Grandpa would've loved him."` },
          ] },
      ],
      epi: {
        close: `Keisha went home on day two with Jalen. She told her seventh graders about weighing pads, and at the end of the year a student did a science fair project on why measuring beats guessing. She sent the unit a photo of the poster.`,
        warm: `Keisha went home on day two. Her hemoglobin was 10.1; she took the iron, mostly. Nia still calls the baby Pickle.`,
        distant: `Keisha Brown was discharged on postpartum day two. Her chart says "uterus firm, lochia moderate." It doesn't say she'd been dismissed before, or that this time she wasn't.`,
        hard: (s, P) => (P.gone ? `Keisha spent the night in L&D with a balloon and two units of blood. When Desmond got back, she said, "I told them it felt wrong." He said, "I know you did."` : P.carbo ? `Keisha's asthma attack after the carboprost frightened her more than the bleeding. She asked for "no more surprises" to be written in her chart.` : `Keisha was still bleeding when the afternoon nurse took over.${P.bladder ? ' The first thing that nurse did was empty her bladder.' : ''} It took two more medicines and a unit of blood to firm her uterus. She went home on day three, pale and tired, with a bottle of iron.`),
      },
    },
    '214': {
      idle: ['lani_after'], after: ['lani_talk'],
      gate: (s, P) => P.mg < 9.5 && (P.sevAt === null || P.bpDrop >= 10),
      guarded: [`"Mm. Later? Everything's heavy."`, `She's asleep. Kainoa puts a finger to his lips.`],
      presence: `You check the pump and then stay a minute. Kainoa hums something under his breath to the baby. Lani smiles with her eyes closed.`,
      beats: [
        { need: 0, learn: `She paddles outrigger canoe; her crew raced the week before her water broke.`,
          text: `"I was in a canoe race three weeks ago. Thirty-four weeks pregnant. The whole crew made me sit in seat three so I wouldn't steer." She laughs, then winces. "Now I can't lift my own arms."`,
          choices: [
            { label: `That's the magnesium, not you. It's protecting your brain while your blood pressure settles. Your arms will come back.`, rap: 1, reply: `"Okay." She lets her hand drop. "Seat three's going to be waiting."` },
            { label: `Wow. That's a lot.`, rap: 0, reply: `"My mom said the same thing."` },
            { label: `Maybe that wasn't the best idea while pregnant.`, rap: -1, reply: `"My doctor said it was fine." She looks away.` },
          ] },
        { need: 1, learn: `She didn't know preeclampsia can come back or start after birth.`,
          text: `"Once the magnesium's done, I'm done with this, right? The preeclampsia's over because she's out?"`,
          choices: [
            { label: `Not always. It can get worse or even start in the first weeks after birth. A bad headache, vision changes, shortness of breath or a pressure over 160: go to the ED, and say you just had a baby.`, rap: 1, set: { taught: true },
              judge: [`comm`, 1, `You taught Ms. Kealoha the warning signs of postpartum preeclampsia.`, `Many preeclampsia deaths happen after discharge. Telling every ED she's postpartum changes how they treat her headache.`],
              reply: `She makes Kainoa write it down. "Headache, vision, breathing, one-sixty. Say I just had a baby."` },
            { label: `Mostly, yes. Delivery is the cure.`, rap: 0, reply: `"Good." She closes her eyes.` },
          ] },
        { need: 2, learn: `Mālia is named for her grandmother.`,
          text: `"Mālia. For my tūtū, my grandma. She paddled too." She looks at the baby in Kainoa's arms. "She's going to hate early mornings, I can tell."`,
          choices: [
            { label: `With two paddlers for parents? She doesn't stand a chance.`, rap: 1, reply: `Kainoa laughs. "Seat six. She's going to steer."` },
            { label: `That's a beautiful name.`, rap: 1, reply: `"Thank you." She smiles at the ceiling.` },
          ] },
      ],
      epi: {
        close: (s, P) => `Lani went home on day four with a blood pressure cuff and a list on the fridge. ${P.taught ? 'On day nine her headache came back with a pressure of 162. She went to the ED and said "I just had a baby," and they treated it in twenty minutes.' : ''} By spring she was back in seat three.`,
        warm: `Lani went home on day four on nifedipine. Her pressure normalized by six weeks. Kainoa took Mālia to the canoe club in a carrier the week after.`,
        distant: `Lani Kealoha was discharged on day four, pressures controlled. Her follow-up was at one week.`,
        hard: (s, P) => (P.icu ? `Lani doesn't remember the ICU. Kainoa does. He says the worst part was the hour before, when she wouldn't wake up and he didn't know if that was normal.` : P.sevAt !== null && (P.firstBpMed === null || P.firstBpMed - P.sevAt > 60) ? `Lani's pressure stayed over 160 longer than it should have. She went home on day five with two medicines and a fear of headaches she says she'll never lose.` : `Lani's magnesium level kept climbing into the afternoon. The next nurse found her reflexes gone and turned the infusion off. She doesn't remember that day well; Kainoa remembers the drowsiness, and how everyone said it was the medicine doing its job.`),
      },
    },
    '216': {
      who: 'linh', watch: true, idle: ['baby_hold', 'linh_after'], after: ['linh_talk'],
      gate: (s, P) => P.checks.length > 0 && !sym(P),
      guarded: [`Linh is concentrating on the latch and doesn't look up. "Not now, please."`, `"Can we talk after his next sugar?" She's watching the clock.`],
      presence: `You sit with Linh while he feeds. She counts his swallows under her breath, then stops counting and just watches him.`,
      beats: [
        { need: 0, learn: `Linh checked her own glucose four times a day for twelve weeks and feels responsible for his lows.`,
          text: `"I did everything right. Four finger sticks a day for twelve weeks. Insulin every night." She touches his heel, where the bandage is. "And he still gets the lows. Because of me."`,
          choices: [
            { label: `Your careful control is why he's only a little low and not a lot. His pancreas got used to making extra insulin; it takes a day or two to adjust. That's not something you did wrong.`, rap: 1, reply: `She's quiet. "Nobody said it like that." She wipes her eyes with the back of her hand. "A day or two."` },
            { label: `It's very common with gestational diabetes.`, rap: 0, reply: `"That's what everyone says." She doesn't sound comforted.` },
            { label: `Well, the diabetes is the reason, yes.`, rap: -1, reply: `She nods and stops talking.` },
          ] },
        { need: 1, learn: `Her own mother wasn't able to breastfeed her; it matters to Linh to try.`,
          text: `"My mom couldn't breastfeed me. She was working two jobs. She cried about it for years." She shifts him on her chest. "I just want one thing to go the way I planned."`,
          choices: [
            { label: `Today's plan protected that: colostrum first, donor milk if he needed more, and he's still at the breast. A lactation consultant can come before you go home.`, rap: 1, set: { lc: true }, reply: `"Yes, please." She relaxes against the pillow. "My mom's going to cry anyway. Happy crying."` },
            { label: `Fed is best, whatever happens.`, rap: 0, reply: `"I know." She says it politely.` },
          ] },
        { need: 2, learn: `Her mother also had diabetes; Linh plans to get tested in six weeks.`,
          text: `"My mom has type 2 now. Is that going to be me?"`,
          choices: [
            { label: `Your risk is higher after gestational diabetes, so get a glucose test 4 to 12 weeks after birth, then every 1 to 3 years. Breastfeeding lowers the risk too.`, rap: 1, set: { taught: true },
              judge: [`comm`, 1, `You taught Linh about her diabetes follow-up.`, `Up to half of women with gestational diabetes develop type 2 within ten years. The postpartum glucose test is often missed.`],
              reply: `"Four to twelve weeks." She puts it in her phone. "And breastfeeding helps. Another reason."` },
            { label: `Maybe. Ask your doctor.`, rap: 0, reply: `"Okay." She adds it to her list of questions.` },
          ] },
      ],
      epi: {
        close: (s, P) => `Linh and the baby, who they named An, went home on day two, still breastfeeding. ${P.taught ? 'She had her glucose test at eight weeks. Normal. ' : ''}She sent the unit a photo at six months: An, enormous, asleep on her shoulder.`,
        warm: `An's glucose stayed over 45 from that morning on. They went home on day two. Linh still keeps a feeding log, though she says it's mostly for fun now.`,
        distant: `Baby Boy Nguyen was discharged on day two. Glucoses stable after the morning of day one.`,
        hard: (s, P) => (P.nicu ? `An spent a week in the NICU. Linh pumped every three hours and brought the milk down in labeled syringes. She still asks, at every appointment, whether his development is on track.` : `Nobody checked An's glucose until the afternoon nurse did. It was 28. He spent two nights in the NICU on IV dextrose. Linh asks, at every appointment, whether a morning like that could have hurt him.`),
      },
    },
    '218': {
      idle: ['sarah_after'], after: ['sarah_talk', 'sarah_si', 'sarah_plan'],
      gate: (s, P) => P.called !== null && P.si,
      guarded: [`"I'm okay. I'm just waiting for the doctor."`, `She's holding Tom's hand and doesn't look up. "Later?"`],
      presence: `You sit in the chair by the window. She doesn't say anything for a while. Then she asks you to hand her the baby, and holds him a little closer than before.`,
      beats: [
        { need: 0, learn: `She stopped sertraline the day her pregnancy test was positive, without asking anyone.`,
          text: `"I stopped my sertraline the day I saw the two lines. Didn't ask anyone. I read something online." She shakes her head. "Three years trying, and I wasn't going to risk anything."`,
          choices: [
            { label: `That came from wanting to protect him. For a lot of people, the risk of untreated depression is bigger than the risk of the medicine, in pregnancy and with breastfeeding. Psychiatry can go through it with you today.`, rap: 1, reply: `"Nobody told me that." She looks at Miles. "I wish someone had told me that."` },
            { label: `You should have talked to your doctor first.`, rap: -1, reply: `"I know." She closes her eyes.` },
            { label: `A lot of people do that.`, rap: 0, reply: `"Do they?" She seems a little relieved.` },
          ] },
        { need: 1, learn: `She drew the plans for the nursery and hasn't been able to imagine herself in it.`,
          text: `"I drew the nursery. Every inch. The light comes in from the east in the morning." She almost smiles. "I could never picture myself in it. Just him."`,
          choices: [
            { label: `That's the depression talking, not the truth about you. When it lifts, a lot of people find the picture comes back.`, rap: 1, reply: `"I hope so." She holds Miles up to the window light for a second. "East light. He's going to like it."` },
            { label: `It sounds beautiful.`, rap: 0, reply: `"It is." Then, quietly, "It is."` },
          ] },
      ],
      epi: {
        close: `Sarah stayed one more night. Psychiatry restarted her sertraline, and she joined a postpartum support group Tom found. At her six-week visit her EPDS was 8. She brought Miles back to the unit at four months, asleep in a carrier, and left a drawing of the east window for the nurses.`,
        warm: `Sarah went home a day later than planned, with a psychiatry follow-up and her sertraline restarted. Tom took two weeks off. At six weeks she said she was "getting there."`,
        distant: `Sarah Mercer was discharged on postpartum day two with outpatient psychiatry follow-up.`,
        hard: `Sarah went home at 14:00, as planned. The discharge checklist had every box ticked.`,
      },
    },
  });
  const sym = (P) => P.glu < 33 || P.temp < 36.2;
})(window.Shift);
