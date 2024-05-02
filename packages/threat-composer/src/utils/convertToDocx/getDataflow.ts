/** *******************************************************************************************************************
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 ******************************************************************************************************************** */
import { Paragraph, HeadingLevel, TextRun, ImageRun } from 'docx';
import convertMarkdown from './convertMarkdown';
import fetchImage from './fetchImage';
import { DataExchangeFormat } from '../../customTypes';

const getDataflow = async (
  data: DataExchangeFormat,
) => {
  const children: any[] = [];

  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [
      new TextRun('Dataflow'),
    ],
  }));

  if (data.dataflow) {
    if (data.dataflow.description) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun('Introduction'),
        ],
      }));

      const sections = await convertMarkdown(data.dataflow.description);
      children.push(...sections);
    }

    if (data.dataflow.image) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun('Dataflow Diagram'),
        ],
      }));

      const image = await fetchImage(data.dataflow.image);

      children.push(new Paragraph({
        children: [
          new ImageRun({
            data: image.image,
            transformation: {
              width: image.width,
              height: image.height,
            },
          }),
        ],
      }));
    }
  }

  return children;
};

export default getDataflow;