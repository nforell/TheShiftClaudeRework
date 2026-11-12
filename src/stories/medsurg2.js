/* Evenings on 4 West. Stories for Pat, Kevin, Bea, Darnell and Amina. */
(function (S) {
  S.story.add('medsurg-4w-2', {
    '421': {
      after: ['pat_anxious'],
      guarded: [`"I'm fine, hon. Just let me breathe." She keeps her eyes shut.`, `"Can't really talk right now." She's concentrating on every breath.`],
      presence: `You sit and breathe with her: in through the nose, out through pursed lips. After a minute she's matching you. Neither of you says a word. It's enough.`,
      beats: [
        { need: 0, learn: `Dispatched tow trucks for thirty-one years.`,
          text: `"Thirty-one years I dispatched tow trucks. Snow days, jackknifed semis, a man who called for a tow because his car was parked on his own lawn." She grins. "You learn to keep your voice calm while everything's on fire. Funny. I can't do it for myself."`,
          choices: [
            { label: `What did you say to a driver who was panicking?`, rap: 1, reply: `"Slow down. Tell me what you see. We'll handle it one thing at a time." She hears herself. "Huh. That's the breathing thing, isn't it? The lips thing." She tries it without being asked.` },
            { label: `You're doing fine.`, rap: 0, reply: `"Am I?" She eyes the oxygen monitor like it might argue.` },
            { label: `That sounds like a stressful job. I couldn\'t do it.`, rap: 0, reply: `"The best kind." She settles back against the pillows.` },
          ] },
        { need: 1, learn: `Blames herself for forty-five years of smoking.`,
          text: `"Forty-five years I smoked. Quit at sixty." She holds up the oxygen tubing. "So this is my fault. You can say it. Everybody's thinking it."`,
          choices: [
            { label: `I'm not thinking that. You quit, and that took real strength. What matters now is keeping you breathing well.`, rap: 1, reply: `She blinks fast. "My sister says I did this to myself." A long breath out through pursed lips. "Thank you for not saying it."` },
            { label: `Quitting at sixty still helped a lot.`, rap: 0, reply: `"Tell that to my lungs." But she seems a little lighter.` },
            { label: `Well, smoking is the main cause of COPD, so it\'s fair to say the cigarettes did this. The important thing is that you\'ve stopped now.`, rap: -1, reply: `"I know." She turns to the window. The cardinal isn't there.` },
          ] },
        { need: 2, learn: `Terrified of dying breathless, at night, alone.`,
          text: `It's quiet. She says it to the window. "Nights are the worst. I wake up and I can't get the air out and I think, this is it. This is how it goes. Alone in the dark, drowning." She presses a hand to her chest. "That's why I ask for the pill."`,
          choices: [
            { label: `That sounds terrifying. Could we make a night plan together: how you'll sit, a fan on your face, the breathing, and when to press the call light, so you're never alone with it?`, rap: 1, set: { nightPlan: true },
              judge: [`comm`, 1, `You let Mrs. Kowalski name her fear of dying breathless.`, `Fear of suffocation drives much of the anxiety in COPD. Naming it, staying with it, and giving her tools that work (positioning, a fan, pursed-lip breathing, her provider's plan) is care, not just comfort.`],
              reply: `She nods, again and again. "A plan. Yes. A plan I can do in the dark." You write it on a card and tape it to the bed rail. She reads it twice.` },
            { label: `You won't be alone. The nurses are right outside.`, rap: 0, reply: `"Right outside." She looks at the door. It helps a little.` },
            { label: `That's just anxiety. Your oxygen level is fine.`, rap: -1, reply: `"Just anxiety." She laughs, short and hurt. "Okay."` },
          ] },
        { need: 3, learn: `Has seen thirty-one kinds of warbler and wants a thirty-second.`,
          text: `She hands you the binoculars. "Go on. The ledge across the way." The cardinal is there, bright red against the brick. "In May the warblers come through the marsh by my house. Forty kinds. I've seen thirty-one." She smiles. "I'd like to get to thirty-two."`,
          choices: [
            { label: `Then let's get you to May. Pulmonary rehab could help you walk the marsh trail again. Want me to ask about a referral?`, rap: 1, reply: `"Rehab." She says it like the name of a new bird. "Irene would drive me. She'd complain the whole way." She's already smiling about it.` },
            { label: `Which one are you still waiting for?`, rap: 1, reply: `"The cerulean. Blue as a gas flame. Never seen one." Her voice goes soft. "This could be the year."` },
            { label: `Pretty bird.`, rap: 0, reply: `"He is." She takes the binoculars back and watches him a long time.` },
          ] },
      ],
      epi: {
        close: `Pat went home on day five with a card on her fridge that says NIGHT PLAN in your handwriting. In May her sister Irene sent 4 West a photo: Pat on the marsh boardwalk, oxygen on, binoculars up. Taped to the back, a small blue feather and "#32. Cerulean. Tell the evening nurse."`,
        warm: `Pat went home on day five. She goes to pulmonary rehab twice a week and reports on the cardinals to anyone who'll listen.`,
        distant: `Pat went home on day five. The anxiety came home with her. Her sister says the nights are still the worst.`,
        hard: `Pat's evening went wrong. She woke up in the ICU with a mask on her face and no memory of how she got there. When she could talk, she asked whether anyone had seen the cardinal.`,
      },
    },

    '423': {
      idle: ['kevin_idle'],
      guarded: [`"I'm good. Just leave the light off." He doesn't look at you.`, `"Yeah, fine." He's scrolling his phone, not really reading it.`],
      presence: `You sit. He puts on a cooking video, some guy in Hanoi making broth. After a while he says, "He's rushing it." You watch the rest together.`,
      beats: [
        { need: 0, learn: `Cooks pho from his mother's recipe. Nine hours for the broth.`,
          text: `"Nine hours for the broth. You char the ginger and onion till they're black, then star anise, cinnamon, cardamom. My mom's recipe. She'd make me start over if I rushed it." He looks at the IV. "Now I can't even eat. Figures."`,
          choices: [
            { label: `What's the secret nobody gets right?`, rap: 1, reply: `"Rock sugar. Just a little. People think it's too sweet, but it's balance." He grins for the first time. "Don't tell anybody. My mom will know it was you."` },
            { label: `You'll be eating again soon.`, rap: 0, reply: `"Yeah. Clear liquids. Great." He almost laughs.` },
            { label: `Nine hours? That's dedication. I can barely manage pasta.`, rap: 0, reply: `"That's pho." He shrugs, a little proud.` },
          ] },
        { need: 1, learn: `Started drinking heavily after his divorce, when he lost the house and the dog.`,
          text: `"The divorce. Everybody asks." He looks at his hands, which are steadier now. "It wasn't dramatic. We just stopped talking. She kept the house. The dog picked her too." A dry laugh. "So I'd close the kitchen and have a beer. Then it was six. Then I stopped counting."`,
          choices: [
            { label: `That's a lot of loss in one year. Thank you for trusting me with it.`, rap: 1, reply: `He's quiet. "Nobody says it like that. They say, 'You gotta stop drinking.' Like I don't know that."` },
            { label: `That\'s a lot. Have you ever tried going to a meeting, or talking to someone about it?`, rap: 0, reply: `"Yeah, yeah." He shrugs. It wasn't the moment.` },
            { label: `That's not a good reason to drink.`, rap: -1, reply: `"Never said it was." He turns toward the wall.` },
          ] },
        { need: 2, learn: `Once woke up on a kitchen floor after quitting cold turkey: a possible withdrawal seizure he never told anyone about.`,
          text: `"Can I tell you something I didn't tell the ER? Last spring I tried to quit on my own. Day two, I'm prepping at work, and then I'm on the kitchen floor. Bit my tongue. My cousin said I was shaking." He swallows. "I told everybody I slipped on grease."`,
          choices: [
            { label: `Thank you for telling me. That sounds like a withdrawal seizure, and it changes how we keep you safe tonight. I'm going to tell your doctor right now.`, rap: 1, set: { seizHx: true },
              judge: [`assess`, 1, `Mr. Tran told you about a possible withdrawal seizure he'd kept hidden.`, `A previous withdrawal seizure is one of the strongest predictors of another. It changes his monitoring and treatment tonight, and he told you because you'd listened first.`],
              reply: `"Is it bad?" You tell him it means watching closely and treating early, and that he did the right thing. He nods, pale, and doesn't argue about the monitor after that.` },
            { label: `You should probably tell the doctor about that.`, rap: 0, reply: `"Maybe." He doesn't look like he will.` },
            { label: `You told everyone you slipped? That's dangerous.`, rap: -1, reply: `"Yeah. I know." He regrets saying it. You can see him decide not to say anything else.` },
          ] },
        { need: 3, learn: `Wants to tell his mother the truth about the drinking, but not yet.`,
          text: `His phone lights up: MOM. He lets it ring. "Every night at eight. She thinks I quit drinking after the divorce. I told her I did." He watches the screen until it goes dark. "She'd blame herself. That's what she does."`,
          choices: [
            { label: `You get to decide when to tell her. If you want, the social worker can help you figure out how, and what support you'd want afterward.`, rap: 1, reply: `He thinks a long time. "After I'm out. When I have a plan. So it's not just bad news." He texts her: in hospital, stomach thing, I'm ok, love you. He shows you before he sends it.` },
            { label: `She'd probably want to know.`, rap: 0, reply: `"Yeah." He sets the phone face down.` },
            { label: `She's going to find out anyway.`, rap: -1, reply: `"Thanks." He sets the phone face down and doesn't pick it up again.` },
          ] },
      ],
      epi: {
        close: `Kevin stayed four more days. The seizure history went into his chart, his withdrawal was treated early, and it passed without another one. The social worker found him a counselor who'd cooked for twenty years. Six weeks later his mother brought a pot of pho to the 4 West night shift. "He told me," she said. "He's doing better. He made this. It's a little sweet."`,
        warm: `Kevin made it through withdrawal and left on day five with a counselor's card in his wallet. He texted his mom from the parking lot. He didn't say what.`,
        distant: `Kevin left on day four. He was back on the line at the restaurant by Friday. It's hard to know whether he kept the counselor's number.`,
        hard: `Kevin's withdrawal got ahead of the team. He spent two nights in the ICU. His mother found out anyway, from a stranger on the phone, which was exactly what he'd been afraid of.`,
      },
    },

    '425': {
      idle: ['bea_idle'],
      guarded: [`"Hm? Oh. I'm fine, dear." You were standing on her left.`, `"Just resting my eyes." She doesn't open them.`],
      presence: `You stand on her right side and wait. She hums something under her breath, slow and sad. "Chopin," she says, eyes closed. "You can stay."`,
      beats: [
        { need: 0, learn: `Taught piano for fifty years. Her late husband Hiro turned the pages, always late.`,
          text: `She pats the right side of the bed. "This side, dear. My left ear retired in 1987: a very enthusiastic student and a very loud Rachmaninoff." She laughs. "Fifty years of lessons. My husband Hiro turned the pages at every recital. Never once on time."`,
          choices: [
            { label: `What did he do when he missed the turn?`, rap: 1, reply: `"He'd hum the next bar, loudly and wrong, so I'd laugh instead of panic." She's smiling at something far away. "Forty-six years. I still hear him humming."` },
            { label: `I'll stand on your right from now on.`, rap: 1, reply: `"Thank you. Most people just shout into the wrong ear." She pats your hand.` },
            { label: `Fifty years is amazing.`, rap: 0, reply: `"It went by in a minute." She smooths the blanket.` },
          ] },
        { need: 1, learn: `Chose DNR after watching CPR on her husband. She still wants blood and every other treatment.`,
          text: `"You've seen the letters on my chart. D-N-R. People see them and stop looking at me." She holds your gaze. "Hiro's heart stopped in our kitchen. I watched them break his ribs for twenty minutes. I won't have that. But I'd like the blood, please. I'd like to see my granddaughter's recital."`,
          choices: [
            { label: `DNR only means no CPR. Everything else, the blood, the fluids, watching you closely: you get all of it. You'll get to that recital.`, rap: 1,
              judge: [`comm`, 1, `You made sure Mrs. Nakamura knew what her DNR does and doesn't mean.`, `DNR means no CPR. It doesn't mean do not treat. She wants blood, fluids and every other treatment, and hearing that from the nurse hanging the blood matters.`],
              reply: `Her eyes shine. "Thank you. The last nurse looked at me like I'd already gone." She holds her arm out for the IV check, steady.` },
            { label: `We'll respect your wishes.`, rap: 0, reply: `"Yes, dear." It's true, but it isn't what she was asking.` },
            { label: `Are you sure you want blood if you're DNR?`, rap: -1, reply: `She stiffens. "Quite sure." The warmth goes out of the room.` },
          ] },
        { need: 2, learn: `Her granddaughter Emi plays a Chopin nocturne at her recital, and asked Bea to turn the pages.`,
          text: `"Emi is eleven. She plays Chopin like she's angry at him." Bea laughs. "Her recital is on the twenty-first. The Nocturne in E-flat. She asked me to turn her pages." A pause. "Hiro would find that very funny."`,
          choices: [
            { label: `Then we have a deadline. Let's get your blood count up so you're turning pages on the twenty-first.`, rap: 1, reply: `"On time," she says firmly. "Unlike some people." She taps the IV pole like a metronome.` },
            { label: `That sounds wonderful. I\'m sure it will go beautifully whether you\'re there or not, and someone can always record it for you.`, rap: 0, reply: `"It will be." She says it like a promise to herself.` },
            { label: `Chopin is beautiful.`, rap: 0, reply: `"It's sad, dear. Beautiful and sad. That's why eleven-year-olds love it."` },
          ] },
        { need: 3, learn: `Taught you the first three bars of the nocturne on the bedside table.`,
          text: `She takes your hand and lays your fingers on the bedside table like it's a keyboard. "Here. E-flat. Now this one. Now lift." She taps the rhythm on your knuckles. "There. The first three bars of the nocturne. Now you know something Chopin wanted you to know."`,
          choices: [
            { label: `Will you teach me the fourth bar next time?`, rap: 1, reply: `"If you practice." She's delighted. "Fifty years, and I still get a new student on the last day."` },
            { label: `That's the nicest thing anyone's done for me at work in a long time.`, rap: 1, reply: `"Then you've been working in the wrong rooms, dear." She pats your hand twice, like a downbeat.` },
            { label: `I can't play, but I'll try.`, rap: 0, reply: `"Everyone can play. Not everyone practices." She winks.` },
          ] },
      ],
      epi: {
        close: `Bea turned Emi's pages on the twenty-first, on time. Keiko sent 4 West the recital program. On the back, in shaky, elegant handwriting: "To my newest student. Bar four is E-flat, B-flat, G. Practice."`,
        warm: `Bea's blood count came up and she went home on day four, with no more ibuprofen. Keiko says she's already teaching Emi's little brother.`,
        distant: `Bea went home on day four. She was polite to everyone. She didn't mention the recital to anyone on the unit.`,
        hard: `Bea's evening got much harder than it should have. She pulled through, slowly. She missed Emi's recital; Keiko recorded it on her phone and played it for her in bed.`,
      },
    },

    '427': {
      idle: ['darnell_idle'],
      guarded: [`"I'm good, I'm good." He keeps grading and doesn't look up.`, `"Just resting, coach." He keeps his eyes on the quiz.`],
      presence: `You sit. He hands you a quiz and the answer key. "Grade this one. Be tough." You are. He's thrilled.`,
      beats: [
        { need: 0, learn: `Coaches JV basketball and teaches U.S. history.`,
          text: `He has a stack of history quizzes on his lap. "Reconstruction. My juniors think it's boring." He looks personally offended. "The most important twelve years in American history, and they think it's boring. That's on me. I gotta teach it better."`,
          choices: [
            { label: `How would you teach it better?`, rap: 1, reply: `His whole face lights up. "Primary sources. Letters. A freedman writing to his old master asking for his back wages. Kids hear that and they sit up." He's gesturing with the red pen. "You'd have been a good student."` },
            { label: `I thought it was boring too.`, rap: 0, reply: `"See? SEE? This is a crisis." He laughs his big laugh.` },
            { label: `You'll be back in the classroom soon.`, rap: 0, reply: `"Yeah. That's the plan." He taps the pen on his knee.` },
          ] },
        { need: 1, learn: `Uses a salt substitute on everything. It's potassium chloride.`,
          text: `"You know what's crazy? I did everything they said. Cut the salt, cut the fast food. Tanya even bought that salt substitute, the No-Salt. I put it on everything." He shrugs. "And here I am, potassium through the roof. Make it make sense."`,
          choices: [
            { label: `That's really important. Most salt substitutes are made of potassium. With your kidneys, that could be part of why your potassium is high. Let's tell the doctor and the dietitian.`, rap: 1, set: { noSalt: true },
              judge: [`assess`, 1, `You caught Mr. Brooks's salt substitute.`, `Most salt substitutes are potassium chloride. For someone with stage 4 kidney disease and a potassium of 5.8, that's a hidden cause, and it only came up because he was comfortable telling you about his kitchen.`],
              reply: `He stares at you. "The No-Salt? That's POTASSIUM?" He's already texting Tanya: THROW OUT THE NO-SALT. "Why isn't that on the label in big letters?"` },
            { label: `Diet changes can be really confusing.`, rap: 0, reply: `"Tell me about it." The moment passes.` },
            { label: `It's probably mostly from the kidney injury.`, rap: 0, reply: `"Yeah, probably." He nods. It's true, but it isn't the whole story.` },
          ] },
        { need: 2, learn: `His father was on dialysis for eleven years. He swore he'd never end up in that chair.`,
          text: `"My dad did dialysis. Eleven years, three days a week. I drove him once I got my license." He turns the red pen over and over. "He'd come out gray. Like the machine took the color out of him." A pause. "I promised myself I'd never end up in that chair."`,
          choices: [
            { label: `That's a heavy thing to carry into this room. Dialysis has changed a lot; some people do it at home, overnight. Would it help to talk through the options with your doctor, with Tanya there?`, rap: 1, reply: `"At home? At NIGHT?" He sits up. "Like, while I sleep? And coach in the afternoon?" He writes HOME DIALYSIS??? on the back of a quiz. "Okay. Okay. That's a conversation."` },
            { label: `You might not need dialysis long-term.`, rap: 0, reply: `"Might not." He holds on to the word. You're not sure that was a kindness.` },
            { label: `Lots of people do fine on dialysis.`, rap: -1, reply: `"My dad did 'fine.'" He puts the pen down. "Okay."` },
          ] },
        { need: 3, learn: `Keeps a clipboard of every player he's ever coached, and where they are now.`,
          text: `He shows you a clipboard, thick with pages. "Every kid I ever coached. Twenty-two years. Where they are now." He flips through: a firefighter, a pastor, a kid in prison he writes to every month, a girl who's a nurse at this hospital. "That's the scoreboard I care about."`,
          choices: [
            { label: `Which one surprised you most?`, rap: 1, reply: `"The kid in prison. He writes back. He's getting his GED." He taps the page. "Nobody's done. Not while they're still breathing."` },
            { label: `Somebody's going to put you on their clipboard someday.`, rap: 1, reply: `He laughs his big laugh, then stops, a little choked up. "Man. Don't do that to me in a hospital gown."` },
            { label: `That's a lot of kids.`, rap: 0, reply: `"Every one of them mattered." He closes the clipboard gently.` },
          ] },
      ],
      epi: {
        close: `Darnell's kidneys came partway back. He went home on day six with no more No-Salt and a home dialysis consult on the calendar "just in case," with Tanya taking notes. In March the JV team sent 4 West a signed basketball. On one panel, in Coach's handwriting: "Primary source. Keep it."`,
        warm: `Darnell went home on day six. His potassium is back in range. The No-Salt went in the trash, and he tells everyone why.`,
        distant: `Darnell went home on day six. Two weeks later his potassium was high again. Nobody had asked what was in his kitchen.`,
        hard: (s, P) => (P.icu ? `Darnell's heart stopped. Calcium and CPR brought it back, and he spent a week in the ICU on dialysis. He's okay now. His JV kids made him a card: COACH DON'T DO THAT AGAIN.` : `Darnell's potassium stayed dangerous far longer than it should have. He was lucky. His JV kids made him a card anyway: COACH DON'T DO THAT AGAIN.`),
      },
    },

    '429': {
      after: ['amina_scared'],
      guarded: [`"I'm okay." She's curled on her side, eyes closed.`, `She nods without opening her eyes.`],
      presence: `You stay a minute. Her mother offers you tea from the thermos. You say no kindly and explain why, Amina translates, and her mother laughs and pats your arm.`,
      beats: [
        { need: 0, learn: `Has been her family's interpreter since she was nine.`,
          text: `Her mom and brother are talking quietly in Somali. Amina rolls her eyes at you, fond. "I've been the family translator since I was nine. Doctor visits, the landlord, parent-teacher conferences. For myself, once." She laughs, then winces. "Today I don't want to translate. I just want to be the patient."`,
          choices: [
            { label: `You shouldn't have to. Let me get a Somali interpreter, so your mom can ask everything and you can rest.`, rap: 1, set: { interpAsk: true },
              judge: [`comm`, 1, `You heard that Amina didn't want to interpret her own care.`, `Family members, and certainly the patient herself, shouldn't be the medical interpreter. A professional interpreter protects accuracy, and lets Amina just be the patient.`],
              reply: `"You can do that?" She looks at you like you've offered her a vacation. "Yes. Please. Hooyo will have a hundred questions." Her mother sees her face and reaches for her hand.` },
            { label: `You're doing great at it.`, rap: 0, reply: `"Thanks." She sounds exhausted.` },
            { label: `Your brother could translate instead.`, rap: 0, reply: `"Abdi's twelve." She shakes her head. "He shouldn't have to hear this stuff."` },
          ] },
        { need: 1, learn: `Has never had surgery, and is scared of not waking up from anesthesia.`,
          text: `"Can I ask a dumb question? When they put you to sleep. What if you don't wake up?" She laughs like it's a joke, but her hands are tight on the blanket. "I've never even had stitches."`,
          choices: [
            { label: `It's not a dumb question. An anesthesiologist stays with you the whole time, watching your breathing and heart every second. Want me to ask them to come meet you before surgery?`, rap: 1, reply: `"Every second?" She lets out a breath. "Yeah. I want to meet the person who watches me." She's a little less pale.` },
            { label: `It's very safe. Don't worry.`, rap: 0, reply: `"Okay." She's still worrying.` },
            { label: `That's a good question for the surgeon.`, rap: 0, reply: `"Right." She nods, and asks nobody else.` },
          ] },
        { need: 2, learn: `Wants to be the first CPA in her family; her mother cleaned offices at night so she could study.`,
          text: `"Second year, accounting. I want to be a CPA. First one in my family who does the taxes instead of getting done by them." She grins. "My mom cleaned offices at night for eleven years so I could do this. My midterm was supposed to be Friday. If I lose this semester..."`,
          choices: [
            { label: `Schools have ways to handle medical absences. I'll ask the team for a letter so you can email your professor tonight.`, rap: 1, reply: `"A letter. Okay." She's already typing with one thumb. "Professor Delacroix is nice. She'll let me make it up." She looks at her mother. "Hooyo. It's okay."` },
            { label: `Your health comes first.`, rap: 0, reply: `"I know." She says it the way people do when they don't feel it.` },
            { label: `One semester isn't the end of the world. Plenty of people take time off and go back, and your professors will understand once they hear you had surgery.`, rap: 0, reply: `"It kind of is, for us." She puts the phone down.` },
          ] },
      ],
      epi: {
        close: `Amina's appendix came out that night, with a Somali interpreter at her mother's side for every question. She emailed Professor Delacroix from recovery. In June her brother Abdi left a card at the 4 West desk: a drawing of a calculator in a graduation cap. "She passed. She says thanks for letting her just be the patient."`,
        warm: `Amina's surgery went well. She went home the next day and took her midterm two weeks late. She got a B-plus and is still annoyed about the minus.`,
        distant: `Amina's surgery went well. Tired and in pain, she translated her own discharge instructions for her mother. No interpreter was offered.`,
        hard: `Amina's surgery was harder than it should have been, and her recovery longer. Her mother didn't leave her side. Abdi did his homework in the waiting room every night.`,
      },
    },
  });
})(window.Shift);
