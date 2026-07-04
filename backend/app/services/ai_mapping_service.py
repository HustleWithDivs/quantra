import os
from typing import List, Dict
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

# 1. Predefined database schema fields expected by your system
DB_TARGET_FIELDS = [
    "sku", "product_name", "upc_ean", "short_description", "long_description",
    "business_category_name", "department_name", "category_name", "sub_category_name", "product_type",
    "brand_name", "supplier_name", "material_name", "barcode", "min_order_qty",
    "weight", "dimensions", "uom", "cost_price", "selling_price", "stock_qty", "color_name", "size_value"
]

class ColumnMappingSuggestion(BaseModel):
    suggestions: Dict[str, str] = Field(
        description="A key-value dictionary where keys are the uploaded file's headers, and values are the matching internal database target fields."
    )

def generate_ai_mapping_suggestions(file_headers: List[str]) -> Dict[str, str]:
    """
    Leverages LLM structural semantic reasoning via OpenRouter to match arbitrary 
    supplier headers to predefined database application fields.
    """
    # Initialize the OpenAI wrapper pointing directly to OpenRouter's base routing URL
    llm = ChatOpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY"), # Reads your openrouter key from environment variables
        model="meta-llama/llama-3.1-70b-instruct", # You can use any open-source model supported by OpenRouter
        temperature=0.0
    )
    
    # Bind structured output capabilities using Pydantic
    structured_llm = llm.with_structured_output(ColumnMappingSuggestion)

    prompt = ChatPromptTemplate.from_messages([
        ("system", (
            "You are an elite AI data-engineering agent specialized in supply chain taxonomy mapping.\n"
            "Match the user's uploaded spreadsheet column headers to our internal target fields.\n\n"
            "Strict Target Internal Fields Available:\n{target_fields}\n\n"
            "Instructions:\n"
            "- Perform semantic and logical mapping (e.g., 'Vendor Code' or 'Item Number' should map to 'sku').\n"
            "- If an uploaded column header has no logical match, exclude it from the dictionary response.\n"
            "- Return only valid mappings matching the strict targeted fields list."
        )),
        ("human", "Uploaded File Column Headers: {uploaded_headers}")
    ])

    runnable = prompt | structured_llm
    result = runnable.invoke({
        "target_fields": ", ".join(DB_TARGET_FIELDS),
        "uploaded_headers": ", ".join(file_headers)
    })
    
    return result.suggestions