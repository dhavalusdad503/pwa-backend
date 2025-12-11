

export function parseBulkFormData<T extends object>(body: Record<string, Partial<T>>,
    files?: Express.Multer.File[] | { [field: string]: Express.Multer.File[] }): T[] {
    const items: T[] = [];
    // const items: any[] = [];

    // 1️⃣ First add all body items: "0", "1", "2", ...
    for (const index in body) {
        items[Number(index)] = { ...body[index] as T };
    }

    let fileArray: Express.Multer.File[] = [];

    if (Array.isArray(files)) {
        fileArray = files;
    } else if (files && typeof files === "object") {
        fileArray = Object.values(files).flat();
    }

    // Merge file fields
    for (const file of fileArray) {
        // file.fieldname = "0[image]"
        const match = file.fieldname.match(/(\d+)\[(.+)\]/);
        if (!match) continue;

        const index = Number(match[1]);
        // const field = match[2];


        if (!items[index]) items[index] = {} as T;
        const itemsTemp = {
            fieldname: file.fieldname,
            originalname: file.originalname,
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            encoding: file.encoding,
            destination: file.destination,
            filePath: `/uploads/other/${file?.filename}`
        };
        items[index] = { ...items[index], ...itemsTemp }
    }

    return items;
}
