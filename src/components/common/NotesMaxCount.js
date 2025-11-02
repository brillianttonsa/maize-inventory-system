
export const checkingValidityCountOfNote = (name, value) => {if (name === "notes") {
    const words = value.trim().split(/\s+/).filter(Boolean);
    console.log(words.length > 3);
    // Allows up to 3 words
    return words.length > 3
}
}



export const wordCounts = (formData) => {
    console.log(formData.notes);
    return formData.notes.trim().split(/\s+/).filter(Boolean).length
    
};

