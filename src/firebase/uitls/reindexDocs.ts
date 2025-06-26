import { writeBatch, doc, type DocumentData, type CollectionReference, type UpdateData } from "firebase/firestore"

const reindexDocs = async (colRef: CollectionReference<DocumentData>, docs) => {
    const sorted = [...docs].sort((a, b) => a.position - b.position)
    const batch = writeBatch(colRef.firestore)

    sorted.forEach((docData, index) => {
        const docRef = doc(colRef, docData.id)
        batch.update(docRef, { position: index } as UpdateData<{position: number}>)
    })

    await batch.commit()
}

export default reindexDocs