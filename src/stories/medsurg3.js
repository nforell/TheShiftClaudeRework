/* Nights on 4 West. Stories for Dorothy, Walter, Kaia, Frank and Renee. Night shift: people say things at 2 a.m. they wouldn't at noon. */
(function (S) {
  S.story.add('medsurg-4w-3', {
    '431': {
      idle: ['dot_calm'],
      guarded: [`"Who are you again, baby?" She's polite, but wary.`, `"I'm fine. Let an old woman sleep."`],
      presence: `You sit with her. She puts her hand out on the blanket, palm up, and you take it. She's asleep in two minutes, still holding on.`,
      beats: [
        { need: 0, learn: `Played the organ at Mount Olive for sixty years.`,
          text: `She's wide awake, hearing aids in, glasses on. "Sixty years on the organ at Mount Olive. Weddings, funerals, the baptisms of all eleven of my grandbabies." She taps the rail like pedals. "You know the secret to a good funeral? Play the hymn a little faster than they expect. Grief drags if you let it."`,
          choices: [
            { label: `What would you want played at yours?`, rap: 1, reply: `"Oh, baby, I've got a list." She counts on her fingers. "And none of it slow. I want them clapping." She cackles, then presses a hand to her hip. "Lord. Don't make me laugh."` },
            { label: `Sixty years is a long time.`, rap: 0, reply: `"Went by like a hymn. Four verses and done." She smiles.` },
            { label: `You should try to rest. It's two in the morning.`, rap: 0, reply: `"Plenty of time to rest when I'm dead." She winks.` },
          ] },
        { need: 1, learn: `Fell reaching for her mother's hymnal. Her son wants her in assisted living.`,
          text: `"I fell reaching for my mother's hymnal. Top shelf. I've reached for that book every Sunday for forty years." She's quiet a moment. "Now my son wants me in one of those places. With the bingo."`,
          choices: [
            { label: `What would it take to keep you home, and safe?`, rap: 1, reply: `"A step stool with a handle. And a lower shelf." She laughs. "Lord, it's that simple, isn't it? I'll make my son move the hymnal. That'll hurt him more than me."` },
            { label: `Your son just wants you to be safe.`, rap: 0, reply: `"Everybody wants me safe. Nobody asks what I want." She says it gently.` },
            { label: `Falls at your age are really dangerous. He\'s right to worry.`, rap: -1, reply: `"Mm-hm." She looks at the ceiling. "So I hear."` },
          ] },
        { need: 2, learn: `Was afraid she'd hurt someone while she was confused.`,
          text: `"The nurse before you said I tried to climb out of this bed." She looks ashamed. "I don't remember. Did I swing at anybody? I would never. I'm a deaconess."`,
          choices: [
            { label: `You didn't hurt anyone. Your bladder was full and you couldn't tell us, so you were trying to get to the bathroom. Once we emptied it, you came right back to yourself.`, rap: 1, reply: `"My BLADDER?" She's scandalized, then delighted. "All that fuss over a full bladder. Don't you dare tell my pastor."` },
            { label: `You were a little confused, that's all.`, rap: 0, reply: `"A little," she repeats, and looks at her hands.` },
            { label: `Don't worry about it. It happens a lot after surgery.`, rap: 0, reply: `"Mm." She wanted to know more than that.` },
          ] },
        { need: 3, learn: `Sang you the first verse of "It Is Well With My Soul" at three in the morning.`,
          text: `The unit is quiet. She says, "You look tired, baby. Come here." When you lean in, she sings, low and steady, the first verse of "It Is Well With My Soul." Her voice is thin and perfectly in tune.`,
          choices: [
            { label: `Thank you. I needed that tonight.`, rap: 1, reply: `"I know you did. I've been watching you run up and down that hall." She pats your cheek. "Go on. I'll be here."` },
            { label: `Will you sing the second verse later?`, rap: 1, reply: `"If you come back and check on me." She smiles. "That's my price."` },
            { label: `You should be sleeping.`, rap: 0, reply: `"So should you." She closes her eyes, still humming.` },
          ] },
      ],
      epi: {
        close: `Dorothy went to rehab on day four and home three weeks later, with the hymnal on the second shelf and a step stool her son grumbled about installing. At Easter her church mailed 4 West a recording of the service. Forty-one minutes in, a thin, perfectly in-tune voice at the organ plays "It Is Well" a little faster than anyone expects.`,
        warm: `Dorothy went to rehab on day four. She's walking with a walker and bossing the physical therapists. Her son moved the hymnal.`,
        distant: `Dorothy went to rehab on day four. Her son is looking at assisted living. She hasn't said yes or no.`,
        hard: `Dorothy's delirium lasted days. She went to a nursing home from the hospital instead of home. Her grandbabies visit on Sundays and play her old records.`,
      },
    },

    '433': {
      idle: ['walter_idle'],
      guarded: [`"Busy. Seven letters." He doesn't look up from the crossword.`, `"Fine, thank you." He's polite and closed.`],
      presence: `You sit. He hands you the puzzle and a pencil, not the pen. "You can do the easy ones. In pencil." You get two. He corrects one of them.`,
      beats: [
        { need: 0, learn: `Surveyed county land for thirty-four years.`,
          text: `"Four letters. '43,560 square feet.'" He doesn't wait. "Acre. The constructor's being lazy tonight." He sets the pen down. "Thirty-four years surveying for the county. I'm constitutionally unable to leave a wrong measurement alone."`,
          choices: [
            { label: `What was the strangest job you surveyed?`, rap: 1, reply: `"A farmhouse where the property line ran straight through the kitchen. Two brothers, one stove, forty years of not speaking." He grins. "I gave them each half the oven."` },
            { label: `I can't read a map to save my life. I'd be lost without my phone.`, rap: 0, reply: `"Nobody's bad at maps. Plenty of people had bad maps." He points the pen at you. "Different thing."` },
            { label: `That's a long career.`, rap: 0, reply: `"Long enough." He picks the pen back up.` },
          ] },
        { need: 1, learn: `His wife Helen died four years ago. He still leaves her half of the crossword blank.`,
          text: `He taps the empty half of the grid. "Helen did the downs. I did the acrosses. Thirty-eight years." He clears his throat. "She's been gone four years and I still leave the downs blank until I remember."`,
          choices: [
            { label: `Tell me about her.`, rap: 1, reply: `"Sharp. Funnier than me, which she'd want you to know." He looks at the blank squares. "She'd have hated this. She'd have been down at that desk demanding things." He smiles. "You'd have liked her."` },
            { label: `I'm sorry for your loss.`, rap: 0, reply: `"Thank you." He fills in one down, carefully.` },
            { label: `Want some help with the downs?`, rap: 0, reply: `"No." Too fast. Then, softer: "No, thank you. Those are hers."` },
          ] },
        { need: 2, learn: `Wants to make it to Friday, when his son flies in from Singapore.`,
          text: `"My son Peter flies in Friday. From Singapore. We haven't talked properly in, oh, six years. Politics, then pride, then habit." He's looking at the ceiling. "The oncologist says months, maybe. I just need Friday. I have things to say that I've been rehearsing."`,
          choices: [
            { label: `Then Friday is the goal. Can I tell you how the clot shots and the leg squeezers help get you there?`, rap: 1, set: { walterGoal: true },
              judge: [`comm`, 1, `You asked Mr. Brandt what matters most to him.`, `His goal, being well enough on Friday, is also the best argument for clot prevention, and it came from him. Goals-of-care conversations turn a refusal into a shared plan.`],
              reply: `He's quiet. "If I'd known that's what they were for, I'd have stuck the needle in myself." He holds out his arm, then laughs. "Belly. Right. Go ahead."` },
            { label: `I hope it goes well with your son.`, rap: 0, reply: `"So do I." He folds the paper.` },
            { label: `That's a lot to hope for.`, rap: 0, reply: `"It's one day. I've had twenty-three thousand of them." He shrugs. "I can hope for one more."` },
          ] },
        { need: 3, learn: `Rehearsed what he'll say to his son, and practiced it on you.`,
          text: `"Can I practice on you? What I'm going to say?" He doesn't wait for an answer. "Peter. I was wrong about more than I was right about. I was proud of you the whole time. I should have said it at your wedding, and at the airport, and every Sunday since." He stops. "Too much?"`,
          choices: [
            { label: `Not too much. Just that. Exactly that.`, rap: 1, reply: `He nods slowly, lips pressed together. "Exactly that." He writes it in the margin of the crossword, in pen, in capitals.` },
            { label: `He's going to be so glad you said it.`, rap: 1, reply: `"I hope so." His eyes are wet. "Helen always said I rehearsed too much and said too little. Let's see."` },
            { label: `You should get some sleep so you're ready.`, rap: 0, reply: `"Yes. Sleep." He puts the paper down, but keeps his hand on it.` },
          ] },
      ],
      epi: {
        close: `Walter was sitting up in a chair on Friday when Peter walked in off a nineteen-hour flight. The day nurse said they talked for three hours with the door closed. Walter died at home six weeks later with Peter beside him. His son mailed 4 West a crossword, finished, the downs filled in by a second, careful hand.`,
        warm: `Walter made it to Friday. He and Peter watched a ballgame together and argued about the umpire. His son says it was the best day they'd had in years.`,
        distant: `Walter made it to Friday. They talked about the flight and the weather. Peter flew home on Sunday. The margin of the crossword stayed blank.`,
        hard: `Walter didn't reach Friday the way he'd hoped. The clot changed everything. Peter arrived to an ICU room and a father who couldn't say what he'd rehearsed.`,
      },
    },

    '435': {
      after: ['kaia_talk'],
      guarded: [`"Mm. Fine. Hungry." She's curled up, eyes closed.`, `"When can I eat?" is all she says.`],
      presence: `You sit. Without a word, she shows you a video of an octopus squeezing itself through a hole the size of a coin. You watch it twice.`,
      beats: [
        { need: 0, learn: `Studies kelp forests. Counts sea urchins eighty feet down.`,
          text: `"I count sea urchins for a living. Well. For a stipend." She holds up her phone: a green underwater forest, sunlight falling through it in columns. "Kelp forest, eighty feet down. The urchins are eating it faster than it grows. I'm trying to figure out why."`,
          choices: [
            { label: `Why do you think it's happening?`, rap: 1, reply: `She sits up, suddenly wide awake. "The sea stars that eat the urchins got wiped out by a disease. So now nobody's in charge." She laughs. "Sorry. You asked. That's my whole personality."` },
            { label: `That's so cool.`, rap: 0, reply: `"It's the coolest." She puts the phone down, smiling.` },
            { label: `You should rest. We can talk later.`, rap: 0, reply: `"Resting. Very hard. With the beeping." She rolls over.` },
          ] },
        { need: 1, learn: `Feels like she failed at her own diabetes after seventeen years without DKA.`,
          text: `"Seventeen years with type 1. No DKA. Not once. I was the kid at diabetes camp who helped the other kids count carbs." She stares at the pump on the table. "And I let this happen. I'm supposed to be good at this."`,
          choices: [
            { label: `A pump site failing isn't a failure on your part. You've done a full-time job with no days off for seventeen years. One bad day doesn't erase that.`, rap: 1, reply: `She blinks fast. "A full-time job with no days off." A shaky laugh. "Can you tell that to my advisor?"` },
            { label: `These things happen.`, rap: 0, reply: `"Yeah." She doesn't believe you.` },
            { label: `You should always carry backup supplies.`, rap: -1, reply: `"I know." She turns to the wall. "I know."` },
          ] },
        { need: 2, learn: `Has been stretching her pump supplies because her insurance changed.`,
          text: `She says it to the ceiling. "Honestly? The site was old. I left it in five days instead of three. The supplies are four hundred dollars a box, and my student insurance changed in August." She laughs, but it cracks. "So I stretch them. Everybody I know stretches them."`,
          choices: [
            { label: `Thank you for telling me. That's exactly the kind of thing that leads to DKA, and it's fixable. Can I ask the case manager to look at supply programs before you go home?`, rap: 1, set: { supplies: true },
              judge: [`assess`, 1, `Ms. Sorensen told you she's been rationing her pump supplies.`, `Cost-driven rationing is a common, hidden cause of DKA, and it will happen again unless someone addresses it. Case managers and social workers can often find programs; the medical team can't fix what nobody tells them.`],
              reply: `She turns her head. "There are programs?" You tell her there often are. She's quiet a moment. "I thought I was the only one who was bad at being broke and diabetic at the same time." She lets you write it down.` },
            { label: `You really shouldn't leave a site in that long.`, rap: 0, reply: `"I know. I'm the one who knows." She closes her eyes.` },
            { label: `Insurance is the worst.`, rap: 0, reply: `"The worst." She sighs, and the subject closes.` },
          ] },
        { need: 3, learn: `Wants to get back on the climbing wall, and is scared of going low halfway up.`,
          text: `"Climbing is the only time my brain shuts up. You can't think about carbs twelve feet up on a crimp." She flexes her calloused fingers. "Now I'm scared of going low halfway up a wall. Of being the girl who needs rescuing."`,
          choices: [
            { label: `That fear makes sense. What if we plan for it: your sensor alarm on, a glucose gel in your chalk bag, a belay partner who knows what low looks like on you?`, rap: 1, reply: `"A gel in the chalk bag." She laughs, surprised. "That's so dumb. That's perfect." She texts her climbing partner right then: LEARN WHAT LOW LOOKS LIKE ON ME.` },
            { label: `You'll get back up there.`, rap: 1, reply: `"Twelve feet at a time." She makes a fist, chalkless, and grins.` },
            { label: `Maybe take a break from climbing for a while.`, rap: 0, reply: `"Maybe." She looks at her hands for a long time.` },
          ] },
      ],
      epi: {
        close: `Kaia went home two days later with her pump running, three boxes of supplies from an assistance program, and a glucose gel taped inside her chalk bag. In the fall she sent 4 West a photo: a kelp forest, sunlight in columns, and in one corner a sea star. "One came back. Nobody's stretching sites anymore."`,
        warm: `Kaia went home two days later. She changes her site on time now, most of the time. She's back on the wall.`,
        distant: `Kaia went home two days later, embarrassed and quiet. She's still stretching her supplies. Her roommate keeps a juice box by the door.`,
        hard: `Kaia's DKA got worse before it got better, and the night frightened her. She went home three days later, more afraid of her own body than she'd been at nine.`,
      },
    },

    '437': {
      idle: ['frank_chat'],
      guarded: [`"I'm fine. Leave the TV on." He's watching the ballgame.`, `"All good, chief." He doesn't look away from the screen.`],
      presence: `You sit through a couple of innings with him. He narrates every pitch. His words are clear and both his hands wave. It's the best neuro check you'll do all night.`,
      beats: [
        { need: 0, learn: `Drove the number 22 bus for thirty years.`,
          text: `"Thirty years on the 22. Downtown to the lake and back, eleven times a day." Both hands on an invisible wheel, every word crisp. "Best mechanic at the yard was a guy named Bell. Could fix a transmission with a coat hanger and bad language."`,
          choices: [
            { label: `What was the best part of the route?`, rap: 1, reply: `"The 6:40 run. Same folks every morning. A nurse going to her shift, a kid with a tuba, an old man who fed the pigeons." He smiles. "You get to know people by where they get off."` },
            { label: `I think I've ridden the 22 once or twice myself.`, rap: 0, reply: `"Then you owe me a dollar twenty-five." He holds out his palm, laughing.` },
            { label: `Thirty years is a long time.`, rap: 0, reply: `"Went by like a green light." He grins.` },
          ] },
        { need: 1, learn: `Grows tomatoes from seeds his late wife Carmen saved.`,
          text: `"Cherokee Purple. Every seed in my garden comes out of Carmen's jar. She saved seeds from the best tomato every summer for forty years." He's quiet a moment. "She's been gone three years. I've still got seeds. Maybe ten more summers' worth."`,
          choices: [
            { label: `Then we'd better get you home for this summer's.`, rap: 1, reply: `"That's what I keep telling the doctor!" He laughs, then looks at you seriously. "Thank you for saying 'home.' Everybody in here says 'discharge.'"` },
            { label: `Can you save seeds from your own tomatoes too?`, rap: 1, reply: `"Every year. She taught me." He nods. "Ten summers turns into forever, if you're careful."` },
            { label: `That's a lovely way to remember her.`, rap: 0, reply: `"She'd say it's a practical way." He smiles. "She was practical."` },
          ] },
        { need: 2, learn: `Worries he's become a burden to his daughter Lupe.`,
          text: `"Lupe took three days off work for this. She's got two kids and a job with the county." He rubs his thumb over his knuckles. "Thirty years driving a bus, never missed a shift. Now I'm the thing she has to pick up."`,
          choices: [
            { label: `It sounds like she wants to be there. Have you asked her how she feels about it?`, rap: 1, reply: `"Asked her? No." He thinks about it. "She'd say, 'Pop, you raised me, shut up.'" He laughs. "She would. I'll ask anyway."` },
            { label: `She's your daughter. She loves you.`, rap: 0, reply: `"I know." He looks at the door. "I know."` },
            { label: `Maybe you could get some help at home so she doesn't have to do everything herself.`, rap: 0, reply: `"Maybe." He doesn't love the idea.` },
          ] },
        { need: 3, learn: `Promised you a Cherokee Purple in August.`,
          text: `"August. Come by the house, the one with the tomatoes eating the fence. I'll give you a Cherokee Purple." He points at you. "Ugly as sin. You eat it standing over the sink with salt, and you'll understand everything."`,
          choices: [
            { label: `Is there a trick to growing them?`, rap: 1, reply: `"Talk to them." He's completely serious. "Carmen talked to them in Spanish. I do English. They grow either way. They just like being noticed."` },
            { label: `I'll hold you to that.`, rap: 1, reply: `"You'd better." He writes "August — tomatoes" on the back of his menu card and presses it into your hand. The handwriting is steady, every letter clear.` },
            { label: `I'm not really allowed to take gifts from patients.`, rap: 0, reply: `"Then it's not a gift. It's a tomato." He waves you off, grinning.` },
          ] },
      ],
      epi: {
        close: `Frank went home on day five, back on a blood thinner with a plan his doctor was comfortable with. In August a paper bag showed up at the 4 West desk addressed "To the night nurse." Inside: three ugly, perfect Cherokee Purples and a packet of seeds from Carmen's jar.`,
        warm: `Frank went home on day five. Lupe says the tomatoes are the best in years. He tells everyone the night nurse was "a good one."`,
        distant: `Frank went home on day five. He didn't say much about the hospital, just that he was glad to be out.`,
        mixed: {
          close: `Frank's stroke was found, but the decision about the clot-busting drug never got made in time. Rehab took the summer. In August a paper bag showed up at the 4 West desk addressed "To the night nurse." Inside: three Cherokee Purples Lupe grew for him, and a packet of seeds from Carmen's jar.`,
          warm: `Frank spent the summer in rehab after his stroke. His right hand is slowly coming back. Lupe says he's already bossing her around in the garden.`,
          distant: `Frank went to rehab after his stroke. He didn't say much about the night it happened.`,
        },
        hard: `Frank's stroke took his words for a while, and the use of his right hand. He's in rehab now, relearning both. Lupe brings him tomatoes from the garden. He can say "tomato" again.`,
      },
    },

    '439': {
      idle: ['renee_awake'],
      guarded: [`"Mm... just sleepy." Her eyes drift shut.`, `"I'm okay. Ask Carl." She doesn't open her eyes.`],
      presence: `You sit a minute. Carl wakes, sees you, and whispers, "Is she okay?" You tell him yes, and what to watch for. He nods like you've thrown him a rope.`,
      beats: [
        { need: 0, learn: `Principal of a middle school with eight hundred students.`,
          text: `"Eight hundred middle schoolers. You know what that is? Eight hundred people going through puberty in one building, and I'm in charge." She laughs carefully, a pillow pressed to her incision. "I'm more scared of the cafeteria on taco day than of this surgery."`,
          choices: [
            { label: `What's the worst thing that's ever happened on taco day?`, rap: 1, reply: `"The Great Guacamole Incident of 2019." She's crying laughing, clutching the pillow. "Stop. I'm not allowed to laugh. Doctor's orders."` },
            { label: `That sounds exhausting.`, rap: 0, reply: `"It's the best job in the world. Don't tell anyone." She smiles.` },
            { label: `You should rest instead of thinking about work. You just had surgery.`, rap: 0, reply: `"I am resting. This is my resting face." She makes a very principal face.` },
          ] },
        { need: 1, learn: `Carl had a heart attack last spring. She's used to being the one who worries.`,
          text: `She glances at Carl, dozing upright in the chair. "He had a heart attack last spring. Forty-seven. I found him in the garage." She keeps her voice low. "Ever since, I'm the one who watches. This is the first time I'm the one in the bed. He doesn't know what to do with his hands."`,
          choices: [
            { label: `So when he keeps reaching for your pain button, it's because he's scared, not careless.`, rap: 1, reply: `"He's terrified." She reaches over and touches his sleeve without waking him. "Tell him how to help me in a way that won't hurt me. He needs a job."` },
            { label: `He seems really devoted.`, rap: 0, reply: `"He is. Too devoted." She smiles, tired.` },
            { label: `You should both get some sleep.`, rap: 0, reply: `"Tell him that." She closes her eyes.` },
          ] },
        { need: 2, learn: `Is grieving the hysterectomy more than she expected to.`,
          text: `It's quiet. "It's silly. We have our boys. We were never having more. The fibroids were awful." She presses the pillow tighter. "But they took something out of me today, and I didn't expect to feel like I lost something. Is that stupid?"`,
          choices: [
            { label: `It's not stupid. Plenty of people feel grief after a hysterectomy, even when it was the right decision. Both can be true.`, rap: 1, reply: `"Both can be true." She repeats it like she's filing it away. "That's going on a poster in the counseling office." She wipes her eyes on the edge of the sheet.` },
            { label: `At least the fibroids won't bother you anymore.`, rap: 0, reply: `"Right. At least." She looks at the ceiling.` },
            { label: `The surgeon said it went really well.`, rap: 0, reply: `"Good. That's good." It isn't what she meant.` },
          ] },
        { need: 3, learn: `Asked you, honestly, how long before she can go back to work.`,
          text: `"I'm going to try to go back to work in a week. I know myself." She fixes you with the look she saves for eighth graders. "Tell me the truth. How long?"`,
          choices: [
            { label: `Usually about six weeks after an open hysterectomy, and nothing heavier than a gallon of milk for a while. The school will survive without you. You won't survive going back early.`, rap: 1, reply: `"Six WEEKS." She groans, then laughs. "Carl. Six weeks. Write it on the fridge." Carl, half asleep, says "Six weeks" and goes back to sleep.` },
            { label: `That's a good question for your surgeon.`, rap: 0, reply: `"You're dodging. I know dodging. I run a middle school." But she smiles.` },
            { label: `Maybe you could work from home?`, rap: 0, reply: `"Oh, I'll definitely be working from home." She grins. That's not what you meant.` },
          ] },
      ],
      epi: {
        close: `Renee stayed home the full six weeks, mostly. Carl took a class on caring for someone after surgery and made a chart for the fridge. On her first day back, the eighth graders held a taco day in her honor. She sent 4 West a photo of the guacamole: "Contained. Barely."`,
        warm: `Renee recovered well and went back to work after five weeks, which her surgeon called "close enough." Carl still checks on her every hour.`,
        distant: `Renee went back to work after two weeks and paid for it with a wound infection. She says she's fine.`,
        hard: `Renee stopped breathing for a moment that night, from the medicine, before anyone caught it. She's okay now. Carl hasn't touched a medication button since, and he watches her breathe while she sleeps.`,
      },
    },
  });
})(window.Shift);
