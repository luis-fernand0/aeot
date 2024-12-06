import imageCompression from 'browser-image-compression';

export async function verificarFoto(inputId) {
    const inputFoto = document.getElementById(inputId)
    const imageFile = inputFoto.files

    if (imageFile.length === 0) {
        return false
    }

    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 200,
        useWebWorker: true,
    }

    try {
        const compressedFileBlob = await imageCompression(imageFile[0], options)
        console.log(compressedFileBlob)
        const compressedFile = 
        new File([compressedFileBlob], imageFile[0].name, {
            type: imageFile[0].type,
            lastModified: Date.now()
        })
        console.log(compressedFile)

        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(compressedFile)
        
        inputFoto.files = dataTransfer.files

        return true
    } catch (error) {
        console.log(error)
        return false
    }

}