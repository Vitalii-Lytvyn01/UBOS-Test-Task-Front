import { createContext } from "react";
import { Product } from "../utility/types";

export const OrderContext = createContext<Product[]>([]);