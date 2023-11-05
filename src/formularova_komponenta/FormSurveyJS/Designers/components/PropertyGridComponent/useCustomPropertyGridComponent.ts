import { useState } from "react";
import * as React from 'react';

export const useCustomPropertyGridComponent = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
    const [childMounted, setChildMounted] = useState<boolean>(false);

    return [childMounted, setChildMounted]
};