import imageCompression from 'browser-image-compression';

export async function comprimirFoto(inputId) {
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
        const compressedFile = 
        new File([compressedFileBlob], imageFile[0].name, {
            type: imageFile[0].type,
            lastModified: Date.now()
        })
        
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(compressedFile)
        
        inputFoto.files = dataTransfer.files

        return true
    } catch (error) {
        console.log(error)
        return false
    }

}