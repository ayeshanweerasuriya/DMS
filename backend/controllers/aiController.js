const { HfInference } = require("@huggingface/inference");
const Patient = require("../models/dental/Patient.js");

// Initialize Hugging Face client with API Key
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const illnessDescriptions = {
    "Cavities": "Cavities, also known as dental caries, are areas of the teeth that have decayed due to bacterial activity. When sugars and starches in food are left on the teeth, bacteria in the mouth convert them into acids, which erode the enamel. Over time, this leads to holes or soft spots in the teeth, making them more vulnerable to infection. If left untreated, cavities can progress deeper into the tooth structure, potentially causing pain, abscesses, and tooth loss. Treatment typically involves removing the decayed part of the tooth and filling it with dental material to restore function.",
    "Gingivitis": "Gingivitis is an early stage of gum disease characterized by the inflammation of the gums caused by a buildup of plaque on the teeth. It is most commonly caused by poor oral hygiene that encourages plaque to form on teeth, leading to infections that affect the gum tissue. Symptoms of gingivitis include red, swollen, and bleeding gums, particularly when brushing or flossing. Gingivitis is generally reversible with proper oral care, including brushing twice a day, flossing, and professional cleanings. If left untreated, gingivitis can lead to more severe forms of gum disease, such as periodontitis.",
    "Periodontitis": "Periodontitis is a severe gum infection that damages the soft tissue and destroys the bone that supports your teeth. It is the result of untreated gingivitis and can lead to tooth loss. The condition begins when plaque and tartar (hardened plaque) spread below the gum line, leading to the inflammation of the deeper tissues that support the teeth. Symptoms include persistent bad breath, gum recession, pocket formation around teeth, bleeding gums, and loose teeth. Periodontitis is a major cause of tooth loss in adults and requires professional dental treatment, which may include deep cleaning, medications, or surgery.",
    "Tooth Decay": "Tooth decay is a progressive condition in which acids break down the enamel of your teeth, resulting in cavities or holes. This process begins when food particles, especially those containing sugars, are left in the mouth. The bacteria in plaque use these sugars to produce acids, which erode the enamel, and over time, the decay spreads deeper into the tooth, possibly reaching the pulp, causing pain and infection. Tooth decay can be prevented by good oral hygiene, including brushing, flossing, and regular dental checkups. Treatment options for cavities include fillings, crowns, or root canals depending on the severity of the decay.",
    "Oral Cancer": "Oral cancer refers to cancer that develops in the mouth, throat, tongue, or lips. It often manifests as sores or growths in the mouth or throat that do not heal, as well as changes in speech or swallowing. Risk factors for oral cancer include tobacco use, excessive alcohol consumption, HPV infection, and a history of sun exposure. Symptoms may include persistent mouth sores, difficulty swallowing, unexplained bleeding in the mouth, and a lump or thickening in the mouth or neck. Early detection is crucial, as oral cancer can spread to other areas of the body if not treated. Treatment may involve surgery, radiation therapy, chemotherapy, or a combination of these methods.",
    "Bruxism": "Bruxism is the involuntary or habitual grinding, clenching, or gnashing of teeth, often occurring during sleep. It can be caused by a variety of factors, including stress, anxiety, sleep disorders, and misalignment of teeth. Bruxism can lead to symptoms such as jaw pain, headaches, tooth sensitivity, and worn-down teeth. Over time, it can cause serious dental issues, including cracked teeth and temporomandibular joint (TMJ) disorders. Treatment options include stress management techniques, dental splints or mouthguards to protect the teeth, and, in some cases, corrective dental work to address misalignment.",
    "Impacted Teeth": "Impacted teeth occur when a tooth fails to emerge fully or properly from the gum line. This is most commonly seen with wisdom teeth, although any tooth can become impacted. Impacted teeth may be angled improperly, unable to break through the gums, or may remain partially erupted, leading to discomfort, infection, or damage to surrounding teeth. Symptoms may include pain, swelling, or infection in the gums. Depending on the severity, treatment may include monitoring the tooth, using pain management strategies, or surgically removing the impacted tooth.",
    "Tooth Sensitivity": "Tooth sensitivity is a condition where certain stimuli—such as hot, cold, sweet, or acidic foods—trigger sharp, temporary pain in the teeth. The cause is typically exposed dentin, the layer beneath the enamel, which becomes sensitive when the protective layer of enamel wears away or gums recede. Common causes of tooth sensitivity include gum disease, tooth decay, or brushing too hard. Treatment may involve using desensitizing toothpaste, fluoride treatments, or dental procedures to address the underlying cause, such as fillings or gum grafts.",
    "Halitosis": "Halitosis, also known as bad breath, is a common condition that can be caused by a variety of factors, including poor oral hygiene, dry mouth, gum disease, or systemic health issues such as respiratory infections, diabetes, or gastrointestinal problems. The odor arises when bacteria break down food particles in the mouth or from the buildup of plaque. In more severe cases, it may be indicative of an underlying medical condition. Good oral hygiene practices such as regular brushing, flossing, and tongue cleaning, along with hydration and regular dental visits, can help manage halitosis. Treatment may also include addressing the underlying cause of the condition.",
    "TMJ Disorders": "TMJ disorders refer to a group of conditions that affect the temporomandibular joint (TMJ), which connects the lower jaw to the skull. The TMJ is responsible for allowing the jaw to move smoothly when talking, eating, and yawning. TMJ disorders can cause pain and discomfort in the jaw, face, neck, or shoulders. Other symptoms may include difficulty opening the mouth, clicking or popping sounds in the jaw, and headaches. TMJ disorders can be caused by injury, teeth grinding, misalignment of the jaw, or stress. Treatment often includes lifestyle changes, physical therapy, splints or mouthguards, medications, and in severe cases, surgical intervention.",
    "Other": "Other dental conditions vary widely and can include rare or less common issues such as oral infections, tooth abscesses, and oral ulcers. Each condition requires specific assessment by a dental professional to determine the best course of treatment. Early intervention is important in managing these conditions to prevent more serious dental problems. It is essential to maintain regular dental checkups to identify any unusual symptoms or conditions that may require specialized care."
};

const illnessTypes = [
    "Cavities",
    "Gingivitis",
    "Periodontitis",
    "Tooth Decay",
    "Oral Cancer",
    "Bruxism",
    "Impacted Teeth",
    "Tooth Sensitivity",
    "Halitosis",
    "TMJ Disorders",
    "Other",
];

const recommendTreatments = async (req, res) => {
    try {
        const { patientId } = req.body;

        // Fetch patient details from MongoDB
        const patient = await Patient.findById(patientId);
        if (!patient) return res.status(404).json({ error: "Patient not found" });

        // // Generate prompt using patient data
        // const prompt = `A ${patient.age}-year-old patient named ${patient.name} has been diagnosed with ${patient.illnessType}. 
        // They have a history of ${patient.notes || "no known conditions"}. 
        // Suggest a personalized dental treatment plan.`; 

        // // Send request to Hugging Face's text generation model (flan-t5-large)
        // const response = await hf.textGeneration({
        //     model: "google/flan-t5-large", // Use Flan-T5, a large T5 model fine-tuned for tasks
        //     inputs: prompt,
        //     provider: "hf-inference",
        // });
        // res.json({ recommendation: response?.generated_text || "No recommendation available." });

        const illnessDescription = illnessDescriptions[patient.illnessType] || "No description available for this condition.";
        const treatmentRecommendation = `Based on the illness type "${patient.illnessType}", the following treatment is recommended: 
        - Treatment for ${patient.illnessType}: ${illnessDescription}`;

        res.json({ recommendation: treatmentRecommendation });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { recommendTreatments };
