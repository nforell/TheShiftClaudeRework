/* Evening shift, 4 North. Stories for Ella, Jordan, Jaylen, Kayla and Eli. */
(function (S) {
  S.story.add('psych-4n-1', {
    '401': {
      idle: ['ella_after'], after: ['ella_talk'],
      guarded: [`"I'm fine. I just want to be left alone until snack."`, `She's under the blanket, facing the window. "Can we talk later?"`],
      presence: `You sit in the chair by the door. She doesn't say anything for a long time. Then, very quietly: "You can stay. If you want."`,
      beats: [
        { need: 0, learn: `Swam the 200 butterfly. Misses the quiet underwater, not the racing.`,
          text: `"I swam the 200 fly. It's the worst event. Everyone hates it." She almost smiles. "I didn't care about winning. I liked being underwater. It's the only place it's quiet."`,
          choices: [
            { label: `What's it like down there, in the quiet?`, rap: 1, reply: `"Blue. Your heartbeat in your ears. Nobody can ask you anything." She looks at the card from her coach. "I haven't been quiet since March."` },
            { label: `You'll be back in the pool in no time.`, rap: 0, reply: `"Sure." She doesn't believe you, and she's being polite about it.` },
            { label: `Swimming probably made it worse, all the training.`, rap: -1, reply: `She stiffens. "It's not the pool's fault." The conversation is over.` },
          ] },
        { need: 1, learn: `The eating disorder "talks like a coach." She calls it the Coach.`,
          text: `"Can I tell you something weird? It talks like a coach. Not my real coach. Like, a worse one. 'You didn't earn that. Do another set.'" She pulls her sleeves over her hands. "I call it the Coach. My therapist says that's okay."`,
          choices: [
            { label: `That sounds exhausting, having a coach in your head all day. What's the Coach saying about dinner tonight?`, rap: 1, set: { coach: true },
              judge: [`comm`, 1, `You helped Ella separate herself from the eating disorder's voice.`, `Naming the illness as something apart from her ("the Coach") is a real treatment technique. Talking to her about it, not arguing with it, keeps her on your side.`],
              reply: `"That I don't deserve it. That everybody's watching how much I eat." She breathes out. "It's quieter when someone sits with me. It's like it doesn't like an audience."` },
            { label: `Just don't listen to it.`, rap: 0, reply: `"Yeah. Easy." She almost laughs. It isn't a happy sound.` },
            { label: `It's just you, though. It's your thoughts.`, rap: -1, reply: `"Great. So I'm the problem." She turns back to the window.` },
          ] },
        { need: 2, learn: `Her beagle Pancake is 14. She wants to be strong enough to walk him again.`,
          text: `"My dog's fourteen. Pancake. He's slow now. I used to walk him every morning before practice." She shows you a photo her mom printed: a grey-faced beagle in a raincoat. "Mom says he waits by the door at seven. For me."`,
          choices: [
            { label: `He's waiting for you. What would it take for you to be strong enough to walk him?`, rap: 1, reply: `She thinks about it seriously. "Eating dinner, I guess. And not doing wall sits." A pause. "I want to walk my dog." It's the first thing she's said today that sounds like her own voice.` },
            { label: `He's adorable.`, rap: 1, reply: `"He's the best." She keeps looking at the photo.` },
            { label: `See, you've got lots of reasons to eat.`, rap: 0, reply: `"I know." She's heard it before. She puts the photo away.` },
          ] },
      ],
      epi: {
        close: (s, P) => `Ella stayed on the eating disorder track for five more weeks. ${P.coach ? 'She kept calling it the Coach, and in family therapy her dad started calling it that too.' : ''} In June she walked Pancake around the block, slowly, both of them. She went back to the pool in the fall, to swim, not to race.`,
        warm: `Ella finished refeeding and moved to the day program. She still hates the 200 fly. She's eating breakfast before school, most days, with her mom at the table.`,
        distant: `Ella moved on to the day program. Her chart says "tolerating meal plan." It doesn't say what dinner was like.`,
        hard: (s, P) => (P.gone ? `Ella spent four days on the pediatric floor on a heart monitor while her phosphorus came back up. She came back to 4 North quieter. The Coach told her the hospital stay was her fault for eating.` : `Ella's phosphorus kept falling overnight. The night nurse made the call at 2 a.m.`),
      },
    },

    '403': {
      idle: ['jor_quiet'], after: ['jor_talk', 'jor_after'],
      guarded: [`"I'm drawing." The headphones stay on.`, `"Not right now. Please."`],
      presence: `You sit nearby while they draw. After a while they slide the sketchbook over: the frog detective, holding an umbrella over a soggy snail. "That's you," they say. "You're the frog."`,
      beats: [
        { need: 0, learn: `Draws "Detective Ribbit," a frog who solves crimes nobody else noticed.`,
          text: `"It's called Detective Ribbit. He solves crimes nobody else noticed happened." They flip pages: a stolen shadow, a missing Tuesday. "Nobody notices small stuff. He does."`,
          choices: [
            { label: `What's the case he's working on right now?`, rap: 1, reply: `"A snail lost its shell and won't tell anyone, because it's embarrassed." They look at you sideways. "It's not about me. Obviously."` },
            { label: `These are really good.`, rap: 0, reply: `"Thanks." They mean it, a little.` },
            { label: `You should draw happier stuff. It might cheer you up.`, rap: -1, reply: `"He IS happy. He's just in the rain." The sketchbook closes.` },
          ] },
        { need: 1, learn: `Their mom died when they were ten. Their dad "got hard" after that.`,
          text: `"My mom would've been fine with Jordan. She let me cut my own hair when I was eight." They touch the uneven fringe. "She died when I was ten. Dad got... hard, after. Like if he loosened up, everything would fall apart."`,
          choices: [
            { label: `It sounds like you lost your mom, and in a way some of your dad too. What do you miss most?`, rap: 1, reply: `"Her laugh. She laughed at my jokes even when they were bad." A long pause. "Dad used to laugh. Before."` },
            { label: `I'm sure your dad loves you.`, rap: 0, reply: `"Yeah. That's kind of the problem." They don't explain.` },
            { label: `Have you tried seeing it from his side?`, rap: -1, reply: `"Every day." Flat. You just became another adult on his side.` },
          ] },
        { need: 2, learn: `Wants a family meeting, with the psychiatrist there, to tell their dad about Jordan.`,
          text: `They've written something on a page torn from the sketchbook: "Things I want to say to Dad." The list is short. The first line is "My name." They hand it to you. "If there was a meeting. With the doctor. Could I say it then? With people there?"`,
          choices: [
            { label: `Yes. That's exactly what family meetings are for, and you'd get to decide what you say and when. I'll tell Dr. Adeyemi you want one.`, rap: 1, set: { meeting: true },
              judge: [`comm`, 1, `You helped Jordan plan to tell their dad, on their terms, with support.`, `Coming out to family with a clinician present can make it safer. The teen leads; the team supports.`],
              reply: `They let out a breath they'd been holding for a while. "Okay. Okay. Don't make me go first."` },
            { label: `You don't have to tell him anything until you're ready.`, rap: 1, reply: `"I know. I think I might be ready, though. Maybe."` },
            { label: `Maybe wait until you're home and things are calmer.`, rap: -1, reply: `"Right. Calmer." They fold the list very small.` },
          ] },
      ],
      epi: {
        close: (s, P) => `${P.meeting ? 'The family meeting was on a Thursday. Jordan read the first line off their list, then couldn\'t read the rest, so Dr. Adeyemi read it with them. Their dad didn\'t say much. On Sunday he called and asked for Jordan.' : 'Jordan went home after two weeks with a safety plan and a sketchbook full of frogs.'} Detective Ribbit's latest case is a snail who got a new shell. It fits.`,
        warm: `Jordan went home after two weeks with a safety plan and a new therapist. The frog comic has fourteen episodes now. They still wear long sleeves, but sometimes they roll them up.`,
        distant: `Jordan was discharged with a safety plan. The chart says "engaged in groups." The sketchbook stayed in their bag.`,
        hard: (s, P) => (P.gone ? `Jordan got eleven stitches in the ED and came back to 4 North on 1:1. The piece of plastic had been in their shoe all afternoon. Tasha sat with them that night and didn't ask any questions. They drew her as a frog.` : `Jordan's long sleeves stayed down. The night shift was the first to look under them.`),
      },
    },

    '405': {
      idle: ['mar_talk'], after: ['mar_after'],
      guarded: [`"I don't wanna talk. Everybody thinks I'm faking everything."`, `He's got the T. rex over his face. "Go away."`],
      presence: `You sit on the floor near his door. Eventually the T. rex peeks out from under the blanket. "Do you know what a Spinosaurus is?" You don't. You find out, at length.`,
      beats: [
        { need: 0, learn: `Knows a Spinosaurus was bigger than a T. rex. Will explain.`,
          text: `"Okay, so everybody thinks T. rex is the biggest, but Spinosaurus was LONGER, and it could swim." He's sitting up now. "Nobody believes me about that either."`,
          choices: [
            { label: `I believe you. How do they know it could swim?`, rap: 1, reply: `"Its bones were heavy, like a penguin's! So it could sink!" He's delighted. "You actually listened."` },
            { label: `That's cool.`, rap: 0, reply: `"It IS cool." He's a little disappointed you didn't ask more.` },
            { label: `Maybe less dinosaurs, more thinking about the chair.`, rap: -1, reply: `"Here we go." The T. rex goes back over his face.` },
          ] },
        { need: 1, learn: `The window happened after his dad didn't show up for his band concert.`,
          text: `He's quiet for once. "The window thing. It was after my concert. My dad said he'd come. I had a solo." He picks at the bandage on his knuckles. "Mom said 'use your words.' I didn't have any words. I had a fist."`,
          choices: [
            { label: `That sounds like a lot of disappointment with nowhere to go. What was the solo?`, rap: 1, reply: `"'Saints.' The drum break." He taps the first few bars on his knee. "I nailed it. Nobody I wanted there heard it."` },
            { label: `Next time try counting to ten.`, rap: 0, reply: `"I know about counting to ten." He's heard it a hundred times.` },
            { label: `You can't punch windows just because you're mad. Everyone gets disappointed sometimes.`, rap: -1, reply: `"I KNOW." The anger is back, fast.` },
          ] },
        { need: 2, learn: `Wants to play his solo for his little sister Zuri at visiting.`,
          text: `"Can my drumsticks come? Not to play here. Just... Zuri's coming Saturday. I could play her the solo on a practice pad. In the family room." He looks at you like he's expecting a no.`,
          choices: [
            { label: `Let's ask the team together. I think that's a great plan.`, rap: 1, reply: `"Really?" He hugs the T. rex. "She's gonna say it's too loud. It's supposed to be loud."` },
            { label: `Maybe. We'll see.`, rap: 0, reply: `"That means no." He's used to "we'll see."` },
            { label: `Instruments aren't allowed on the unit. It's a safety thing, sorry.`, rap: -1, reply: `"Of course." He doesn't ask for anything else today.` },
          ] },
      ],
      epi: {
        close: `Jaylen played "When the Saints Go Marching In" for Zuri in the family room on Saturday. It was too loud. She covered her ears and laughed the whole time. Haloperidol is on his allergy list now, and he can explain why, with dinosaur metaphors.`,
        warm: `Jaylen went home after ten days on a new medication plan. His mom says he still loses it sometimes, but he comes and finds her after. Zuri has the T. rex back.`,
        distant: `Jaylen was discharged home. The chart says "behavior improved." He doesn't talk much about 4 North.`,
        hard: (s, P) => (P.icu ? `Jaylen spent the night in the ED with his airway watched until the dystonia was gone. He came back to 4 North scared of every pill in a cup. It took a week before he'd take one without asking what it did to necks.` : `Jaylen's neck stayed twisted for hours. He doesn't trust anyone who says "faking" now. That's fair.`),
      },
    },

    '407': {
      idle: ['kay_later', 'kay_safe'], after: ['kay_wait'],
      gate: (s, P) => P.disclosed || P.deferredAt !== null || s.t >= 60,
      guarded: [`"I'm okay. I'm just tired."`, `She's watching the door. "Not right now."`],
      presence: `You sit with her while the hall gets loud with dinner. She doesn't talk. When the hall door buzzes, she flinches, and then looks at you, and you're still there. Her shoulders come down a little.`,
      beats: [
        { need: 0, learn: `Goalkeeper. "The only position where you're allowed to grab things that come at you."`,
          text: `"I played keeper. Goalie." She mimes a dive. "It's the only position where you're allowed to grab things that come at you. Everybody else has to kick them away."`,
          choices: [
            { label: `I like that. What did you love about it?`, rap: 1, reply: `"You can see the whole field from the goal. Nothing sneaks up on you." She stops. "I liked that a lot."` },
            { label: `Why'd you quit?`, rap: 0, reply: `"Just... got tired." She's done with that question.` },
            { label: `You should get back into it. Exercise helps depression.`, rap: -1, reply: `"Okay." Polite, and closed.` },
          ] },
        { need: 1, learn: `Her little brother Gabe is nine. She's been the one who walks him to school.`,
          text: `"My brother's nine. Gabe. I walk him to school every day. He's scared of the crossing guard." A faint smile. "Who's walking him now?"`,
          choices: [
            { label: `You've been taking care of him. It sounds like you worry about him a lot.`, rap: 1, reply: `"Somebody has to." She says it fast, and then looks like she wishes she hadn't.` },
            { label: `I'm sure your mom's got it covered. That's her job, not yours, so try to let it go.`, rap: 0, reply: `"Yeah." She doesn't sound sure at all.` },
            { label: `Focus on yourself for now.`, rap: -1, reply: `She doesn't answer. Gabe is not something she can stop focusing on.` },
          ] },
        { need: 2, learn: `Wants to go to her abuela's when she leaves, with Gabe.`,
          text: `She's holding the note for Gabe. "My abuela lives in Fresno. She has a lemon tree and she makes me do my homework at the kitchen table." She folds and unfolds the note. "If I could go there. Me and Gabe. Is that something people can ask for?"`,
          choices: [
            { label: `It's something you can ask for, and the social worker is the right person to ask. I'll make sure she hears it from you tomorrow.`, rap: 1, set: { abuela: true },
              judge: [`comm`, 1, `You connected Kayla's wish for a safe place to the person who can act on it.`, `Where a child goes after a disclosure is a safety plan, not a nurse's promise. Getting her wish to social work and CPS is how it can happen.`],
              reply: `"Okay." She tucks the note in her hoodie pocket. "Can you be here when I tell her?"` },
            { label: `That sounds really nice.`, rap: 1, reply: `"It is." She smiles at the note.` },
            { label: `That's up to your mom.`, rap: -1, reply: `Her face closes. "Right."` },
          ] },
      ],
      epi: {
        close: (s, P) => (P.reported ? `CPS opened a case that night. Kayla and Gabe went to their abuela's in Fresno while it was investigated. ${P.abuela ? 'She told the social worker herself, with a nurse sitting beside her.' : ''} In September she tried out for a club soccer team as keeper. She made it.` : `Kayla told you, and you stayed. The report still has to be made; the night nurse picked it up at 21:00.`),
        warm: (s, P) => (P.reported ? `CPS opened a case. Kayla went to stay with her abuela while it was investigated. She walks Gabe to school from there now. It's a longer walk. She doesn't mind.` : `Kayla's disclosure still needs to be reported. She's waiting for an adult to do what she was promised.`),
        distant: `Kayla was discharged with a safety plan and an outpatient therapist. She kept her hoodie zipped to the chin the whole time.`,
        hard: (s, P) => (P.rickIn ? `After the visit, Kayla stopped talking to staff. The night nurse found the note to Gabe in her pocket and called the hotline herself. Sometimes the second adult is the one who listens.` : `The report was never made. Kayla went home at the end of the week. What happens next isn't in any chart.`),
      },
    },

    '409': {
      after: ['eli_after'],
      gate: (s, P) => !P.gone,
      guarded: [`"I'm good." He's curled up, arm over his stomach.`, `"Can I just sleep?"`],
      presence: `You sit with him. He doesn't talk, but after a while he asks you to stay until the next check. You do.`,
      beats: [
        { need: 0, learn: `Plays bass in a band called Low Battery. Their best song is about a vending machine.`,
          text: `"I play bass. Band's called Low Battery." A tired almost-smile. "Our best song is about a vending machine that steals your dollar. It's a metaphor. For everything."`,
          choices: [
            { label: `What's the metaphor?`, rap: 1, reply: `"You put stuff in and nothing comes out. You keep hitting it anyway." He shrugs. "College apps. Basically."` },
            { label: `That's funny.`, rap: 0, reply: `"Yeah." He closes his eyes.` },
            { label: `You should be focusing on getting better, not your band.`, rap: -1, reply: `"Sure." He turns over.` },
          ] },
        { need: 1, learn: `Waiting on one college letter. Scared his mom will be disappointed whatever it says.`,
          text: `"I'm waiting on one letter. Just one school. Everyone thinks I'll get in." He stares at the ceiling. "My mom found my note the same day I checked the portal and it said 'decision pending.' I don't even know which one made me do it."`,
          choices: [
            { label: `That sounds like a lot of pressure to carry by yourself. What do you think your mom would say, if she knew?`, rap: 1, reply: `"That she doesn't care about the school." A pause. "She said that in the ER. I didn't believe her. Maybe I should."` },
            { label: `You'll get in. You're obviously smart.`, rap: 0, reply: `"That's what everyone says." Which is the problem.` },
            { label: `College isn't worth dying over.`, rap: -1, reply: `"Obviously." He's flat. You've made it simple, and it isn't.` },
          ] },
      ],
      epi: {
        close: `Eli spent three days on pediatrics with N-acetylcysteine until his liver tests turned around, then came back to 4 North. His mom visited every day. In April the letter came. He didn't get in. He told the group about it, and then about the vending machine song.`,
        warm: `Eli recovered on pediatrics and came back to finish his stay on 4 North. Low Battery played a show in June. He was on bass.`,
        distant: `Eli transferred to pediatrics, then back to 4 North. The chart says "medically recovered." He never said much to the evening staff.`,
        hard: (s, P) => `The overdose wasn't found that evening. Eli's liver kept failing overnight until the night nurse saw the yellow in his eyes. He started the antidote a day later than he should have and spent most of a week on pediatrics. Everyone had said "medically cleared."`,
      },
    },
  });
})(window.Shift);
