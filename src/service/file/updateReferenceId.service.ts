//node-backend\src\service\file\updateReferenceId.service.ts
import { FileModel } from "@/models/file.model";
import { handleDbError } from "@/utils/handleDbError";

const updateReferenceId = async (fileName: string, referenceId: number) => {
    try {
        const res = await FileModel.updateReferenceId(fileName, referenceId);
        return res;
    } catch (err: unknown) {
        console.error(err);
        handleDbError(err);
        throw err;
    }
};

export default updateReferenceId;