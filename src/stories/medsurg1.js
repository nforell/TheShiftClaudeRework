/* Days on 4 West. Stories for Marcus, Grace, Eleanor and Samuel. */
(function (S) {
  S.story.add('medsurg-4w-1', {
    '412': {
      idle: ['bell_idle'],
      guarded: [`"I'm fine, chief. Don't worry about me."`, `He keeps his eyes on the game. "All good."`],
      presence: `You sit. The game goes to commercial. "Denise hates this team," he says eventually, to nobody. It's the first thing he's said that isn't "fine."`,
      beats: [
        { need: 0, learn: `Quit smoking two weeks ago, because Denise asked him to.`,
          text: `He mutes the TV. "Two weeks ago I quit smoking. Thirty years, cold turkey, because Denise asked me to. Then my gut blows a hole in itself." He almost laughs, then catches the incision. "Universe has a sense of humor."`,
          choices: [
            { label: `Two weeks without a cigarette is already helping. More oxygen gets to that incision. Your timing is better than it feels.`, rap: 1, reply: `"Huh." He looks down at his belly like it might be listening. "Don't tell Denise she was right. She'll frame it."` },
            { label: `The universe owes you one, then.`, rap: 0, reply: `"Put it on my tab." He unmutes the game.` },
            { label: `Honestly, the smoking probably didn't help your gut either. It slows healing everywhere, so the best thing you can do now is stay quit for good.`, rap: -1, reply: `His face goes flat. "Yeah. Heard that one." The TV comes back on.` },
          ] },
        { need: 1, learn: `His brother Ray died of an overdose at 49. That is why pain pills scare him.`,
          text: `"You asked about the pain pills. My brother Ray hurt his back at the plant, got a bottle of pills, then got everything else. We buried him at forty-nine." He turns his wedding ring. "So when somebody says 'oxycodone,' I hear Ray."`,
          choices: [
            { label: `I'm sorry about Ray. Thank you for telling me. Can we make a plan together, so you get what you need to heal and nothing that scares you?`, rap: 1,
              judge: [`comm`, 1, `You let Mr. Bell tell you why pain medicine frightens him.`, `Asking about the story behind a fear turns a refusal into a plan you make together. Now you both know what "safe" means to him.`],
              reply: `He nods slowly. "Lowest dose. You tell me when it's time to step down. And you don't let me get stupid about it." He holds out his hand to shake on it.` },
            { label: `Addiction does run in families, so it's smart to be careful.`, rap: 0, reply: `"Yeah." He goes quiet. You're not sure whether you eased the fear or confirmed it.` },
            { label: `That won't happen to you. You're only here a few days.`, rap: -1, reply: `"That's what Ray's doctor said." He doesn't look at you.` },
          ] },
        { need: 2, learn: `Hid three days of belly pain from Denise before he came in.`,
          text: `"Want to know something dumb? I had the pain three days before I came in. Told Denise it was the chili. I didn't want to be the guy in the ambulance." He picks at the blanket. "Forty years fixing buses. You don't pull a bus off the road for a little noise. Then it's a big noise."`,
          choices: [
            { label: `A lot of people wait. In here, I want the little noises: dizziness, new pain, trouble breathing. The sooner you tell me, the easier it is to fix. Deal?`, rap: 1, set: { bellHonest: true },
              reply: `"Little noises." He points at you. "You're gonna regret that. I'm a very noisy bus." Twenty minutes later he tells you, unprompted, that he felt lightheaded when he reached for his water. He told you.` },
            { label: `Well, you're here now. That's what matters.`, rap: 0, reply: `"I guess." He shrugs, and winces.` },
            { label: `Three days? You could have died.`, rap: -1, reply: `"Yeah. Denise said that too. Loudly." He shuts down.` },
          ] },
        { need: 3, learn: `He and Denise restored the old number 9 bus for the transit museum.`,
          text: `He finds a photo on his phone: a green-and-cream city bus, gleaming, with a woman in a ball cap grinning from the driver's seat. "Old number 9. Denise and me restored her for the transit museum. Took four years." A pause. "So why'd you get into this, anyway? Nursing."`,
          choices: [
            { label: `Honestly? Moments like this one.`, rap: 1, reply: `He snorts. "Smooth." But he's pleased. "Denise is gonna want to meet you. Brace yourself. She hugs."` },
            { label: `Someone took good care of my family once. I wanted to be that person for somebody else.`, rap: 1, reply: `He's quiet a second. "Yeah. That's a good reason." He sets the phone face up on the table, the bus turned toward you.` },
            { label: `Long story. Let's get you walking first.`, rap: 0, reply: `"Always working." He grins and swings his legs to the edge of the bed. "Fine. Show me how to do this without splitting in half."` },
          ] },
      ],
      epi: {
        close: `Marcus walked a full lap of the unit with Denise before he went home on day four, holding his IV pole like the rail on the number 9. A month later a card came to 4 West: a photo of the bus, and on the back, "For the nurse who made me a deal. Ray would've liked you. Still quit. — M."`,
        warm: `Marcus went home on day four. Denise says he walks the block twice a day and complains the whole way, which she counts as a good sign.`,
        distant: `Marcus went home on day four. He didn't say much at discharge, and nobody found out why he wouldn't take his pain pills. At his follow-up he admitted he'd barely touched them. Too sore to breathe deep at home, and the surgeon could hear it in his lungs.`,
        hard: `Marcus's recovery took longer than it should have. Denise stayed every evening. When he finally went home, he told her the nurses were fine, and didn't say anything else about it.`,
      },
    },

    '414': {
      idle: ['okafor_later'],
      guarded: [`"I'm fine. Just trying to get through these." She taps the stack of lab reports.`, `She gives you a polite smile. "All good."`],
      presence: `You sit while she grades. After a while she hands you a report. "Tell me if this kid's hypothesis makes sense." It doesn't. You tell her. She laughs.`,
      beats: [
        { need: 0, learn: `Teaches seventh-grade science and grades lab reports from bed.`,
          text: `She holds up a lab report covered in red pen. "Seventh grade. This one says plants eat dirt. Very confident. Terrible handwriting." She caps the pen. "Sorry. Grading calms me down. Everything in here beeps."`,
          choices: [
            { label: `What do you tell a kid who's sure plants eat dirt?`, rap: 1, reply: `She lights up. "You weigh the dirt before and after you grow the bean. He's going to be so mad when it doesn't change." For a minute she isn't a patient at all.` },
            { label: `You should really rest instead of working on those right now.`, rap: 0, reply: `"This is resting." She uncaps the pen again.` },
            { label: `Twenty-eight of those? Rather you than me.`, rap: 0, reply: `She laughs. "Twenty-seven. I'm very efficient when I'm scared."` },
          ] },
        { need: 1, learn: `Stopped checking her feet months ago. She can't feel them, and she's afraid to look.`,
          text: `"Can I tell you the stupid part? My dad wouldn't let anyone see his feet. Not even my mother. By the time anybody looked, it was too late." She stares at the blanket over her left foot. "I haven't looked at my own feet in months. I can't feel them anyway. It's easier not to know."`,
          choices: [
            { label: `That makes sense, after what you saw with your dad. Would you let me show you a two-minute foot check with a mirror, so knowing gets less scary?`, rap: 1, set: { footTeach: true },
              judge: [`assess`, 1, `Mrs. Okafor told you she'd stopped checking her feet.`, `Neuropathy plus avoidance is how small wounds become amputations. She told you because you'd earned it. Now the foot check is something she wants, not a lecture.`],
              reply: `She takes a long breath. "Okay. Show me. I teach observation for a living. I should be able to do it on myself." She holds the mirror herself.` },
            { label: `You really need to check them every day.`, rap: 0, reply: `"I know." She says it the way her students do.` },
            { label: `That's how your dad ended up losing his leg.`, rap: -1, reply: `Her face closes like a door. "Thank you. I'm aware."` },
          ] },
        { need: 2, learn: `Spends every weekend caring for her mother, who has dementia.`,
          text: `"Nine point eight. My A1c. I know what that means, I teach cellular respiration." She laughs without smiling. "Every weekend I drive to my mother's. She has dementia. I cook for her and eat whatever's in the vending machine at the rest stop. By Monday I forget I have a pancreas."`,
          choices: [
            { label: `That's a lot to carry. What would make those weekends even a little easier on your own health?`, rap: 1, reply: `She thinks like a scientist. "Pack my meals on Friday. Put the glucometer by her coffee maker, where I'll see it." She writes it on the back of a lab report. "Hypothesis."` },
            { label: `You have to put yourself first sometimes.`, rap: 0, reply: `"Everybody says that. Nobody says how." She goes back to grading.` },
            { label: `Nine point eight is really high. You need to take this seriously, whatever else is going on at home.`, rap: -1, reply: `"I said I know what it means." The pen scratches harder.` },
          ] },
        { need: 3, learn: `Her students built her a get-well DNA model out of gummy bears.`,
          text: `She turns her tablet around. A photo: a lopsided double helix made of gummy bears and toothpicks, and a sign in marker: GET WELL MS. O. WE DID IT WRONG ON PURPOSE. Her eyes are wet. "Adenine only pairs with thymine. They know that. I taught them that."`,
          choices: [
            { label: `They wanted to make sure you'd come back to correct it.`, rap: 1, reply: `She laughs so hard she has to hold her side. "Oh, I'm coming back. With a rubric."` },
            { label: `They sound like they love you.`, rap: 1, reply: `"Don't," she says, wiping her eyes and smiling. "I'll ruin my professional reputation."` },
            { label: `Cute. Let's check your glucose.`, rap: 0, reply: `"Right. Of course." She holds out her finger, still looking at the photo.` },
          ] },
      ],
      epi: {
        close: `Grace went home on oral antibiotics with a hand mirror in her bag and a glucometer on her mother's coffee maker. In the spring her class sent 4 West a second model, correct this time, with a note: "Ms. O checks her feet every night. We check her work."`,
        warm: `Grace went home the next day on oral antibiotics. Her foot healed. She still grades from the couch, but she props the leg up now.`,
        distant: `Grace went home the next day. She was polite at discharge and didn't ask many questions. Hard to say whether she's looking at her feet.`,
        hard: `Grace's stay got longer and harder than it needed to be. She was gracious about it, the way teachers are with a difficult class. She didn't say much about the nurses.`,
      },
    },

    '416': {
      after: ['whitfield_early'],
      gate: (s, P) => P.sev < 32,   // she can only tell you who she is once the infection lets go
      guarded: [`"Hello, dear." She smiles politely, the way you'd smile at a stranger on a bus.`, `"I'm quite all right, thank you." She looks toward the window.`],
      presence: `You sit with her. She dozes, wakes, and seems surprised you're still there. "You're not in a hurry," she says. "That's rare."`,
      beats: [
        { need: 0, learn: `Read aloud to children for forty years as a librarian.`,
          text: `She's sitting up with her glasses on, clearer-eyed than at seven. "I'm sorry, dear. I think I was a bit of a muddle this morning." She smooths the blanket. "Forty years a children's librarian. I read Where the Wild Things Are out loud more times than any human being should. They always wanted the wild rumpus page twice."`,
          choices: [
            { label: `Did you do the voices?`, rap: 1, reply: `"Oh, the voices were mandatory." She does Max, then a Wild Thing: a very good roar for eighty-two. Down the hall, Luis laughs.` },
            { label: `You were sick. The infection caused the confusion.`, rap: 1, reply: `"That's what Ruth said on the phone. An infection. How undignified." She smiles anyway.` },
            { label: `That sounds like a lovely career.`, rap: 0, reply: `"It was." She looks out the window for a while. "It was."` },
          ] },
        { need: 1, learn: `Her cat Biscuit arrived through the library's book drop in a snowstorm.`,
          text: `"Biscuit came to me through the book drop. Truly. January, a snowstorm, 2012, and there's this orange kitten sitting on top of the returns, looking very put out." She laughs. "He's been overdue ever since." Then, quieter: "Has anyone fed him?"`,
          choices: [
            { label: `Let's find out right now. Would you like me to dial Ruth for you?`, rap: 1, set: { biscuitFed: true }, reply: `"Would you? My fingers are all thumbs today." Ruth answers on the first ring. Biscuit has been fed, and is furious about the delay. Eleanor closes her eyes, relieved.` },
            { label: `I'm sure someone's taking care of him.`, rap: 0, reply: `"I'm sure." She isn't. She glances at the phone on the table.` },
            { label: `Try not to worry about the cat right now. Cats are tough, and you need your strength.`, rap: -1, reply: `"He isn't 'the cat,' dear. He's Biscuit." She folds her hands and says nothing more.` },
          ] },
        { need: 2, learn: `Afraid Ruth will make her give up the house she's lived in for fifty-one years.`,
          text: `"Ruth wants me to move in with her. She's been working up to it for a year, and now she has her proof." She taps the IV. "I've lived in that house fifty-one years. I know which stair creaks. I'm not ready to be somebody's project."`,
          choices: [
            { label: `That house is part of who you are. What would help you feel safe there, so you and Ruth could look at options together?`, rap: 1,
              judge: [`comm`, 1, `You explored Mrs. Whitfield's fear of losing her home instead of taking a side.`, `Older adults recovering from delirium often fear losing their independence. Listening, then naming real options (a home safety check, a medical alert, a visiting nurse) supports her autonomy and her safety at once.`],
              reply: `She thinks. "A grab bar in the tub. One of those buttons on a necklace. Perhaps someone to look in on Tuesdays." A pause. "Ruth would like that. She likes a list." She asks you to write it down for the case manager.` },
            { label: `Ruth probably just wants you to be safe.`, rap: 0, reply: `"I know what Ruth wants." She says it kindly, and the conversation is over.` },
            { label: `After this, living alone might not be safe anymore.`, rap: -1, reply: `Her eyes fill. "Well. Now it's two against one."` },
          ] },
        { need: 3, learn: `Asked you, and not Ruth, what she said while she was confused.`,
          text: `She reaches for your hand. "Can I ask you something I can't ask Ruth? This morning. Was I... terrible? Did I say things?"`,
          choices: [
            { label: `You were very sick, and the infection did that. The whole time, the only thing you worried about was Biscuit.`, rap: 1, reply: `She laughs a little shakily. "Well. That's in character." She squeezes your hand. "Thank you for telling me the truth."` },
            { label: `You kept asking what day it was, and you tried to go home. Nothing you need to apologize for.`, rap: 1, reply: `"Trying to go home." She smiles. "Also in character." She lets go of your hand slowly.` },
            { label: `Don't worry about it. Everyone gets confused in the hospital.`, rap: 0, reply: `"Everyone," she repeats. She doesn't sound comforted.` },
          ] },
      ],
      epi: {
        close: `Eleanor went home on day five with a grab bar in the tub, a pendant on a chain, and a Tuesday nurse visit that Ruth set up from your list. She mailed 4 West an old paper library card with one book checked out: Where the Wild Things Are. Due date: whenever you like.`,
        warm: `Eleanor went home on day five. Ruth stays over on weekends now. Biscuit has forgiven everyone, eventually.`,
        distant: `Eleanor recovered and went home on day six. Ruth has started touring assisted living. Eleanor hasn't agreed to anything.`,
        hard: `Eleanor spent three days in the ICU before she came back to herself. She doesn't remember most of this shift. Ruth does.`,
      },
    },

    '418': {
      idle: ['ortiz_idle'],
      guarded: [`"Mija, I'm fine. Just tired." He smiles, but he's watching you.`, `"All good, all good." He pats Rosa's hand instead of answering.`],
      presence: `You sit. Rosa offers you a tamale from her bag. Samuel says, "Don't let her feed you, she'll never stop." For a moment you feel like family.`,
      beats: [
        { need: 0, learn: `Planted half the jacaranda trees on Del Mar Street.`,
          text: `"Forty years I planted other people's yards, mija. Half the jacarandas on Del Mar Street are mine. Every May the whole street goes purple, and not one of those people knows my name." He grins. "Doesn't matter. The trees know."`,
          choices: [
            { label: `What was your favorite job?`, rap: 1, reply: `He doesn't hesitate. "A school, 1988. The kids helped me plant. One of them teaches there now. She sends me a picture every spring." He points at his phone. You look.` },
            { label: `That's beautiful. Let me get your vitals.`, rap: 0, reply: `"Always the vitals." He holds out his arm, amused.` },
            { label: `I love jacarandas.`, rap: 0, reply: `"Everybody does. They're messy. Beautiful things usually are." He winks at Rosa.` },
          ] },
        { need: 1, learn: `Skips his water pill on the days he watches his grandkids.`,
          text: `He lowers his voice so Rosa can't hear. "Can I tell you a secret? The water pill. Tuesdays and Thursdays I watch the grandkids. Two little ones, a park, no bathroom for a mile." He shrugs. "So those days I skip it. Rosa would kill me."`,
          choices: [
            { label: `Thank you for telling me. That's fixable. Let's ask the doctor about timing it for after the kids go home, so it's a plan you can actually keep.`, rap: 1, set: { lasixSecret: true },
              judge: [`assess`, 1, `Mr. Ortiz told you he skips his furosemide on babysitting days.`, `That missed dose is a direct cause of his fluid overload, and he'd never have said it in front of Rosa or on a form. Now the team can change the timing instead of just adding more pills.`],
              reply: `He looks relieved, like he's been carrying it for a while. "After they go home. Why didn't anybody ever ask me that?" He lets you write it down for Dr. Chen.` },
            { label: `You can't skip it. That's how you ended up in here.`, rap: 0, reply: `"Yeah, yeah." He waves it off. You're not sure anything will change.` },
            { label: `I'll have to tell Rosa, so she can make sure you take it.`, rap: -1, reply: `His face falls. "Please don't. I'll take it." He doesn't tell you anything else.` },
          ] },
        { need: 2, learn: `Treats his heart's "thirty percent" like a test he means to pass the second time.`,
          text: `"The doctor said my heart is thirty percent. She said it like a grade." He taps his chest. "Night school, English class, my first test, I got thirty percent. Second test, ninety-one. So I'm thinking: what do I do for the second test?"`,
          choices: [
            { label: `That's the right question. Weigh yourself every morning, keep to the salt and fluid limits, take the pills on time, and walk a little every day. Want to go over it with Rosa?`, rap: 1, reply: `"A study guide." He laughs. "Rosa is the best student in this family. Yes. Teach her, and she'll teach me."` },
            { label: `Thirty percent can still mean a good life, with the right treatment.`, rap: 0, reply: `"Good." He nods. "Good. But what's the homework?"` },
            { label: `Heart failure doesn't really get better.`, rap: -1, reply: `The grin goes out of him. "Okay, mija." He looks out the window a long time.` },
          ] },
        { need: 3, learn: `Married to Rosa for fifty-one years. Wants her told he behaved.`,
          text: `Rosa has gone down to the cafeteria. He watches the door. "Fifty-one years. She still brings me caldo like I'm going to leave her for the hospital food." He smiles. "Do me a favor. When I'm gone, tell her I behaved. Even if I didn't."`,
          choices: [
            { label: `You can tell her yourself for a long time yet, once we get this fluid off.`, rap: 1, reply: `"You hear that, vieja?" he says to the empty chair. "The nurse says a long time." He seems to believe it.` },
            { label: `I'll tell her you behaved. And that you still love her soup.`, rap: 1, reply: `"Don't tell her that! She'll bring more." He laughs until he coughs, then waves off your concern. "Worth it."` },
            { label: `Let's not talk like that.`, rap: 0, reply: `"Okay, okay." He pats your hand. "Nurses. Always in a hurry to make you feel better."` },
          ] },
      ],
      epi: {
        close: `Samuel went home three days later, two kilos lighter, with his water pill moved to the afternoon and a study guide on the fridge in Rosa's handwriting. In May a photo arrived at 4 West: Del Mar Street, purple from end to end. On the back: "The trees say hello. So does Rosa. I behaved."`,
        warm: `Samuel went home three days later, two kilos lighter. Rosa weighs him every morning and writes it on the calendar. He complains about it, and lets her.`,
        distant: `Samuel went home three days later. He was back in the ED within a month, short of breath again. Nobody had asked him about Tuesdays and Thursdays.`,
        hard: `Samuel's day went badly before it got better. Rosa slept in the chair beside his ICU bed. When he woke up, the first thing he asked for was her caldo.`,
      },
    },
  });
})(window.Shift);
