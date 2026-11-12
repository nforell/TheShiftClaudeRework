/* Day shift, 5 South. Stories for Mateo's family, Aaliyah, Leo, Noah's dad, and Zoe. */
(function (S) {
  S.story.add('peds-5s-1', {
    '501': {
      who: 'lucia', watch: true,
      gate: (s, P) => P.interp,
      guarded: [`Lucía is rocking Mateo and doesn't look up. Through the interpreter: "Later, please. I'm watching him breathe."`, `She gives you a tired, polite smile and keeps her hand on his chest.`],
      presence: `You sit with her for a few minutes and watch Mateo's chest rise and fall together. Neither of you needs the interpreter for this. When he settles, she lets out a breath, and you both smile.`,
      beats: [
        { need: 0, learn: `The family moved here last spring and has no relatives nearby. Lucía hadn't eaten since yesterday.`,
          text: `Through the interpreter: "We moved here in the spring for my husband's work. No family here. My mother is in Oaxaca. She calls every hour to ask about him." She laughs a little and wipes her eyes. "I've been in this chair since yesterday."`,
          choices: [
            { label: `You've been taking care of him all night. What do you need, for you? Coffee? Food? A real chair that reclines?`, rap: 1, reply: `She looks surprised, like nobody has asked her that. "...Coffee. And maybe the chair." When you bring both, she holds the cup with both hands and closes her eyes for a second. "Gracias. Of course, gracias."` },
            { label: `He's lucky to have you here.`, rap: 0, reply: `"Thank you." She nods and turns back to him.` },
            { label: `You should go home and rest. We'll watch him, and you're no good to him if you're exhausted. He won't even know you're gone.`, rap: -1, reply: `"No." She doesn't need the interpreter for that one. She doesn't move.` },
          ] },
        { need: 1, learn: `Sofía, 11, translates for her mother everywhere and wants to be a doctor.`,
          text: `Sofía is doing homework at the foot of the crib, but she's watching the high-flow machine more than her worksheet. Lucía, through the interpreter: "She translates for me everywhere. The bank, the doctor, the school. She's eleven." She strokes Sofía's hair. "She wants to be a doctor."`,
          choices: [
            { label: `(To Sofía) Want me to show you how this machine helps your brother breathe? No translating needed. Just for you.`, rap: 1, reply: `Sofía's face lights up. You show her the warm, wet air, the flow number, how the prongs sit. "So it's like... a breeze that helps him push?" Exactly. Lucía watches her daughter ask questions, and looks proud enough to cry.` },
            { label: `She's such a big help to you.`, rap: 0, reply: `Sofía shrugs, a little embarrassed. "I'm used to it."` },
            { label: `She can keep translating, then. It's faster than waiting for the interpreter, and she clearly understands what's going on.`, rap: -1, reply: `Sofía's shoulders fall a little. The interpreter frowns at the phone.` },
          ] },
        { need: 2, learn: `Before Sofía, Lucía lost a baby boy who lived four days. She's terrified of this room.`,
          text: `It's quiet now, and Sofía has gone for a snack. Lucía speaks slowly, and the interpreter's voice softens. "Before Sofía, I had a boy. He was born too early. He lived four days, in a room like this, with the same sounds." She touches the monitor wire. "When the machine beeps, I'm back there."`,
          choices: [
            { label: `I'm so sorry. That makes this room so much harder. Mateo is different, and I'll tell you what every beep means. You won't have to guess. We'll watch him together.`, rap: 1,
              judge: [`comm`, 1, `You made room for Lucía's grief and gave her a way to feel less alone.`, `A family's past shapes how they live through the present. Naming what the alarms mean, and doing it together, turns every beep from a memory back into information.`],
              reply: `"Together." She says it in English. Then, through the interpreter: "His name was Tomás." You'll remember that. For the rest of the shift, every time an alarm sounds, she looks at you first, and waits.` },
            { label: `He's in good hands. You don't need to worry.`, rap: 0, reply: `She nods, but her hand stays on the wire.` },
            { label: `This is very different. Bronchiolitis is common.`, rap: -1, reply: `"Yes." It's the right fact. It's not what she needed.` },
          ] },
      ],
      epi: {
        close: `Mateo went home five days later, eating well. Lucía learned the nurses' names and taught them how to say Tomás properly. Sofía wrote her science fair project on "How High-Flow Oxygen Helps Babies Breathe." She got first place. 5 South has a copy on the break room fridge.`,
        warm: `Mateo came off high-flow and went home in five days. Lucía asked for the Spanish-language handout twice, once for herself and once for her mother in Oaxaca.`,
        distant: `Mateo went home after five days. Sofía did most of the talking at discharge.`,
        hard: `Mateo went to the PICU for more support. Lucía rode in the elevator with him, holding his foot. On the second day he turned the corner. She still stands up every time a monitor beeps.`,
      },
    },

    '503': {
      gate: (s, P) => P.trusted,
      idle: ['aal_after'],
      guarded: [`She has one earbud in. "I'm okay. Just tired."`, `She's pretending to sleep. You can tell because she's too still.`],
      presence: `You sit. She pulls out an earbud and holds it out: marching band music. You listen together for a song. "That's my part," she says, tapping the clarinet line. "It's hard."`,
      beats: [
        { need: 0, learn: `First-chair clarinet. Cold weather sets off her crises, so her band director brings a sleeping bag to games.`,
          text: `"I'm first chair clarinet." She says it like it's a secret she's proud of. "Cold makes crises happen, so football games are the worst. Mr. Reyes brings a sleeping bag for me. I play from inside a sleeping bag. Like a burrito with a clarinet."`,
          choices: [
            { label: `A clarinet burrito. I need to see a picture of this.`, rap: 1, reply: `She laughs, which hurts, and she laughs anyway. She finds the photo: a purple sleeping bag, a clarinet sticking out, and the whole woodwind section giving thumbs-up. "They all signed it after homecoming."` },
            { label: `It's great your director helps you out with that. Not all of them would.`, rap: 0, reply: `"Yeah. He's cool." She puts the earbud back in.` },
            { label: `Maybe you should skip the cold games.`, rap: -1, reply: `"I'm not quitting band." Her voice is very flat.` },
          ] },
        { need: 1, learn: `An ED nurse once said "You again." She's never forgotten it.`,
          text: `"Can I tell you something?" She's quiet. "Last year a nurse in the ED saw me come in and said 'You again.' Like I was the problem." She picks at her blanket. "Now I wait too long to come in. Because I don't want to be 'you again.'"`,
          choices: [
            { label: `I'm really sorry that happened. You're never a problem for coming in. Pain like yours is real, and getting here early is exactly right. You did the right thing today.`, rap: 1,
              judge: [`comm`, 1, `You acknowledged the stigma Aaliyah has faced and told her coming in early is right.`, `People with sickle cell disease often meet bias in the ED, and it makes them delay care. Delays mean worse crises and missed complications like acute chest syndrome.`],
              reply: `Her eyes fill up, and she blinks hard. "Okay." Then: "Can you write that down for my mom? That I did the right thing? She always thinks she should've brought me sooner." You write a card. She tucks it under her pillow.` },
            { label: `That nurse was probably just tired.`, rap: -1, reply: `"Yeah. Everyone's always tired." She turns away.` },
            { label: `That's not okay.`, rap: 0, reply: `"No." She nods. It helps a little.` },
          ] },
        { need: 2, learn: `Her friend Destiny had a stroke at 13. She promised to tell you right away about any chest pain.`,
          text: `"My friend Destiny has sickle cell too. We met at camp. When she was thirteen, she had a stroke." Aaliyah stares at the ceiling. "She's okay now. She talks slower. She still plays the drums." A pause. "I think about it every single time I'm in here."`,
          choices: [
            { label: `That must be scary to carry. Here's something that helps: tell me right away about any chest pain, trouble breathing, weakness, or a headache that's different. Those are things we act on fast. You won't be bothering me.`, rap: 1, set: { aalChest: true },
              reply: `"Right away." She nods. "Chest, breathing, weakness, headache." She counts on her fingers. "Destiny would tell me to say it louder."` },
            { label: `That won't happen to you.`, rap: -1, reply: `"You don't know that." She's right. She stops talking.` },
            { label: `I'm glad she's okay.`, rap: 0, reply: `"Me too." She hums along to her music, quietly.` },
          ] },
      ],
      epi: {
        close: `Aaliyah went home after four days. Her mom kept the card from her pillow and put it on the fridge: "You did the right thing." At homecoming the next fall, Aaliyah played first chair from inside a purple sleeping bag. Her next admission, she came in early.`,
        warm: `Aaliyah went home in four days with a new pain plan. She told her hematologist she wanted "the same nurses as last time."`,
        distant: `Aaliyah went home after four days. She kept her earbuds in most of the stay.`,
        hard: (s, P) => (P.icu
          ? `Aaliyah went to the PICU with acute chest syndrome and needed an exchange transfusion. It was a frightening week. When she got home, she asked Mr. Reyes to hold her chair. He did.`
          : `Aaliyah's pain stayed high all evening, and "drug-seeking" went into her chart. It will be there the next time she comes in, and the time after that. She told her mom that next time, she's going to wait longer before she says anything.`),
      },
    },

    '505': {
      idle: ['leo_talk'],
      guarded: [`Leo hides his face in Rexy. "No."`, `He's watching a truck video on his mom's phone and doesn't want to be interrupted.`],
      presence: `You sit on the floor so you're smaller than him. After a minute, Leo slowly hands you Rexy to hold. You hold Rexy very carefully. He watches to make sure you're doing it right.`,
      beats: [
        { need: 0, learn: `Rexy the dinosaur "has a owie" too. Leo lets you check Rexy first.`,
          text: `Leo holds up a green T. rex with one eye missing. "Rexy has a owie." He points to Rexy's tummy, right where Leo's own pain is.`,
          choices: [
            { label: `Oh no. Can I check Rexy first? Then maybe you, after?`, rap: 1, reply: `You listen to Rexy's tummy with your stethoscope, very seriously. "Rexy is being so brave." Leo nods, pleased. Then he pulls up his own shirt for you. That's therapeutic play: now he knows what's coming.` },
            { label: `Rexy looks like a very good dinosaur. He can watch while I check you.`, rap: 0, reply: `"He is." Leo holds Rexy tighter.` },
            { label: `Let's look at your tummy now, okay?`, rap: -1, reply: `Leo starts to cry and hides behind Min-ji.` },
          ] },
        { need: 1, learn: `Rexy has tiny arms but a big bite. Rexy is scared of shots.`,
          text: `"T. rex has tiny arms." Leo shows you, holding his arms close. "But BIG bites." He chomps at the air. Then, quieter: "Rexy is scared of shots."`,
          choices: [
            { label: `A lot of people are scared of shots. That's okay. If Rexy gets one, I'll tell him first, and he can squeeze your hand.`, rap: 1, reply: `Leo thinks about it. "Rexy can squeeze." He tucks Rexy under his arm like he's protecting him. Tell a three-year-old the truth, simply, and he can get ready.` },
            { label: `No shots today!`, rap: -1, reply: `He smiles. You've just made a promise you can't keep. Next time he'll remember.` },
            { label: `Big bites! Rawr!`, rap: 1, reply: `"RAWR!" Leo roars back, delighted, and forgets he hurts for a second.` },
          ] },
        { need: 2, who: 'minji', learn: `Min-ji gave two days of prune juice because she thought it was constipation. She feels guilty.`,
          text: `While Leo naps, Min-ji talks quietly. "I gave him prune juice for two days. I thought it was constipation. He was crying and holding his tummy, and I gave him PRUNE JUICE." She presses her hand to her mouth. "What kind of mother doesn't know it's appendicitis?"`,
          choices: [
            { label: `A good one. Appendicitis is really hard to spot in little kids, even for doctors. It often looks like a tummy bug at first. You brought him in when it changed. That was the right call.`, rap: 1,
              judge: [`comm`, 1, `You eased Min-ji's guilt with facts about appendicitis in young children.`, `Parents often blame themselves. In toddlers, appendicitis is frequently missed at first because they can't describe the pain well. Guilt-free parents are better partners in care.`],
              reply: `She lets out a shaky breath. "Even doctors?" Even doctors. She looks at Leo sleeping, and for the first time since the ED, her shoulders drop.` },
            { label: `He's getting good care now.`, rap: 0, reply: `"Yes." She nods, but you can see she's still thinking about the prune juice.` },
            { label: `Next time, it's best to come in sooner.`, rap: -1, reply: `She flinches. "Yes. I know." She doesn't say anything else.` },
          ] },
      ],
      epi: {
        close: `Leo went home three days after surgery. Rexy got a bandage on his tummy to match. Min-ji sent a photo to 5 South: Leo and Rexy, both with bandages, both roaring. She wrote: "Even doctors. Thank you."`,
        warm: `Leo recovered well and went home in three days. Rexy came too, of course.`,
        distant: `Leo went home after three days. Min-ji said thank you at discharge and didn't say much else.`,
        hard: `Leo needed extra monitoring after his breathing slowed. He was fine by the next morning. Min-ji didn't sleep that night. She held Rexy the whole time.`,
      },
    },

    '507': {
      who: 'travis', watch: true,
      guarded: [`Travis is on his phone. "Yeah?" He doesn't look up.`, `"I'm good. Just tired, man."`],
      presence: `You stand with him for a minute while Noah sleeps. Travis rubs his eyes. "I haven't slept since Tuesday," he says. It's the first thing he's told you that isn't about going home.`,
      beats: [
        { need: 0, learn: `Travis is 20 and works 4 a.m. warehouse shifts. He and Noah's mom trade Noah off in a parking lot.`,
          text: `"I'm twenty." He says it like an excuse, or an apology. "I load trucks at four in the morning. His mom works days. We hand him off in the Walgreens parking lot at three." He looks at Noah. "Nobody told me it'd be this hard. Everyone just said 'congratulations.'"`,
          choices: [
            { label: `It is hard, especially without sleep. How are you doing, really?`, rap: 1, reply: `He's quiet for a second. "Honestly? I'm scared all the time. I don't know if I'm doing it right." He rubs his face. "Nobody asks me that. They ask about him."` },
            { label: `You're doing a lot for a twenty-year-old. Most guys your age wouldn't even be here.`, rap: 0, reply: `"I guess." He shrugs.` },
            { label: `Well, you're a dad now.`, rap: -1, reply: `"Yeah. I know." He goes back to his phone.` },
          ] },
        { need: 1, learn: `Travis asked whether it was bad to put Noah in his crib and step outside when he wouldn't stop crying.`,
          text: `He keeps his voice low. "Can I ask you something and you won't tell anyone? Sometimes he cries for, like, hours. Nothing works. So I put him in his crib and go outside and just stand there." He won't look at you. "Is that bad? Does that make me a bad dad?"`,
          choices: [
            { label: `I can't promise to keep things secret. That's part of my job. But what you described, putting him down safely and stepping away, is exactly the right thing to do. The one thing never to do, no matter how frustrated you get, is shake him. It can seriously hurt his brain.`, rap: 1, set: { purple: true },
              judge: [`comm`, 1, `You were honest about confidentiality and taught Travis safe coping for crying.`, `Never promise secrecy: you're a mandated reporter. Inconsolable crying is a top trigger for abusive head trauma. Teaching "put him down safely, walk away, never shake" is prevention.`],
              reply: `He nods slowly. "Never shake. Put him down. Walk away." He repeats it. "Nobody ever told me that it was okay to walk away." You hand him a handout about the Period of PURPLE Crying. He reads the whole thing.` },
            { label: `Don't worry, it stays between us.`, rap: 0,
              judge: [`comm`, -1, `You promised Travis secrecy.`, `You can't keep that promise. You're a mandated reporter, and what he tells you might need to be shared. Be honest up front, so trust isn't broken later.`],
              reply: `He relaxes. "Okay, cool." He doesn't know you can't really promise that.` },
            { label: `You shouldn't leave him alone.`, rap: -1, reply: `His face shuts down. "Forget it." He picks up his phone.` },
          ] },
        { need: 2, learn: `Noah is named after the grandfather who raised Travis. Travis says he needs help.`,
          text: `"He's named after my grandpa. Noah. He raised me, after my mom left." Travis touches the crib rail. "He'd know what to do. He always knew what to do." A long pause. "I think I need help. Like, real help. I don't know who to ask."`,
          choices: [
            { label: `Asking for help is what good parents do. Our social worker can help with things like sleep, childcare, and support for new dads. Can I have her come talk with you?`, rap: 1, reply: `"A social worker. Okay." He takes a breath. "Yeah. Okay. My grandpa would've said yes." He sits up a little straighter.` },
            { label: `You're doing fine.`, rap: 0, reply: `"Am I?" He doesn't sound sure.` },
            { label: `Maybe his mom should take more of the load.`, rap: -1, reply: `"She's working too." He shakes his head. "Forget it."` },
          ] },
      ],
      epi: {
        close: (s, P) => (P.reported
          ? `Social work and child protection are still working out what happened to Noah, carefully, as they should. That part isn't the nurse's to decide. What you can know: Travis met with the social worker, joined a group for new dads${P.purple ? ', and kept the PURPLE Crying handout folded in his wallet' : ''}. Noah went home with a safety plan while the family got help.`
          : `Noah's bruises never made it into a report, so nobody outside this room will ask how they happened. Travis opened up to you more than to anyone. ${P.purple ? 'He took home what you taught him: put him down, walk away, never shake.' : ''} It's the only protection that went home with Noah.`),
        warm: (s, P) => (P.reported
          ? `Noah's case went to child protection for review, as it should. Travis met with social work before he left. ${P.purple ? 'He told her, "The nurse said it\'s okay to walk away."' : 'He answered every question she asked.'}`
          : `Noah went home. There's no report, so no one will check in. Travis said thanks on the way out.`),
        distant: (s, P) => (P.reported
          ? `Noah's case went to child protection for review. Travis didn't talk much to the staff. What happened at home is still unknown.`
          : `Noah went home. What happened to him is unknown, and without a report no one is going to find out.`),
        hard: (s, P) => (P.icu
          ? `Noah went to the PICU with bleeding under his skull. The hospital reported it, as it had to, and child protection opened an investigation. Whatever it finds, the signs were there to see on this shift.`
          : `Noah went home${P.bruises ? ' with bruises that were seen and never reported' : ' with an injury no one looked for'}. A report is how a four-month-old gets protected when he can't say what happened. There wasn't one.`),
      },
    },

    '509': {
      idle: ['zoe_talk'],
      guarded: [`She's reading a book about octopuses and holds up a finger: "One more page."`, `"I'm reading." She doesn't look up.`],
      presence: `You sit and she reads to you, out loud, from her octopus book. She skips the hard words and makes up new ones. Octopuses, according to Zoe, have "bluemanic" blood. You don't correct her.`,
      beats: [
        { need: 0, learn: `Loves octopuses. Her favorite is Olive, the giant Pacific octopus at the aquarium.`,
          text: `"Octopuses have THREE hearts. And blue blood. And they can change color." She shows you a picture of a big red octopus. "This is Olive. She's a giant Pacific octopus at the aquarium. She's my favorite. She can open jars."`,
          choices: [
            { label: `Three hearts! Which one does Olive use to open jars?`, rap: 1, reply: `Zoe giggles. "Not her HEARTS, her ARMS! You're silly." She explains for five minutes, happily, and only stops for a breath twice.` },
            { label: `That's really cool.`, rap: 0, reply: `"I know." She goes back to her book.` },
            { label: `That's neat, but let's focus on your breathing now, okay?`, rap: -1, reply: `"Okay." She puts the book down and looks worried.` },
          ] },
        { need: 1, learn: `She hides her inhaler at school because a boy named Brayden calls her Darth Vader.`,
          text: `Zoe whispers. "I don't use my inhaler at school." She looks at the door. "Brayden says I sound like Darth Vader when I use it. Everyone laughed. So I keep it in my backpack. In the bottom."`,
          choices: [
            { label: `That sounds really embarrassing. Your inhaler helps you breathe, so it's important. Could we talk to your mom and your teacher about a private place to use it, like the nurse's office?`, rap: 1, set: { schoolInhaler: true },
              judge: [`assess`, 1, `You found out Zoe was hiding her inhaler at school.`, `Asking about how kids really use their medicine, and why, often explains repeated admissions. Kids hide inhalers out of embarrassment. A school asthma plan can fix that.`],
              reply: `She thinks about it. "The nurse's office has a fish tank." She nods. "Okay. But don't tell Brayden." You won't.` },
            { label: `You should use it even if he teases you.`, rap: 0, reply: `"But everyone LAUGHS." She hugs her book.` },
            { label: `Just ignore him.`, rap: -1, reply: `She stops talking and reads.` },
          ] },
        { need: 2, learn: `Her lips turned blue in September. She's scared of it happening while she's asleep.`,
          text: `She's quiet for a long time. Then: "In September my lips went blue. Mom said I looked like a Smurf, but she was crying." Zoe hugs her book. "What if it happens when I'm asleep? What if nobody sees?"`,
          choices: [
            { label: `That sounds really scary. While you're here, we're watching all the time, even while you sleep. That's what this sticker on your finger is for. And we'll make a plan with your mom so it doesn't get that bad again.`, rap: 1, reply: `She looks at the pulse ox on her finger. "It watches me sleep?" It does. "Like Olive watches her tank." She seems satisfied by that.` },
            { label: `That won't happen again.`, rap: -1, reply: `"You don't know that." Zoe is eight, and she is right.` },
            { label: `You're safe here.`, rap: 0, reply: `She nods, but she hugs the book tighter.` },
          ] },
      ],
      epi: {
        close: `Zoe went home the next day with a spacer, a school asthma plan, and a pass to the nurse's office. She hasn't been admitted since. Her mom sent a drawing to 5 South: a red octopus with an inhaler in one of its eight arms. The label says "Olive (brave)."`,
        warm: `Zoe went home with a new spacer and a plan. Her mom wrote the steps on the fridge.`,
        distant: `Zoe went home the next day. Her mom had a stack of handouts. Zoe had her octopus book.`,
        hard: `Zoe went to the PICU on continuous albuterol. She was scared. The PICU nurse found her an octopus video and let her watch it all night.`,
      },
    },
  });
})(window.Shift);
