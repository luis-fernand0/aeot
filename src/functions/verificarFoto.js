import imageCompression from 'browser-image-compression';

export async function verificarFoto(inputId, span, btnId) {
    const inputFoto = document.getElementById(inputId)
    const imageFile = inputFoto.files
    if (imageFile.length === 0) {
        document.querySelector(`.${span}`).classList.remove('hidden-span-alert')
        document.querySelector(`#${btnId}`).classList.remove('checked-foto')
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

        document.querySelector(`.${span}`).classList.add('hidden-span-alert')
        document.querySelector(`#${btnId}`).classList.add('checked-foto')

        return true
    } catch (error) {
        console.log(error)
        return false
    }

}