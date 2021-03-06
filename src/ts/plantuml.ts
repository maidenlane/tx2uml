import { spawn } from "child_process"
import path from "path"
import VError from "verror"
import { Readable, Writable } from "stream"

export const outputFormats = <const>["png", "svg", "eps"]
export type OutputFormat = typeof outputFormats[number]

export interface PlantUmlOptions {
  format?: OutputFormat
  limitSize?: number
  config?: string
  pipemap?: boolean
}

export const streamPlantUml = async (
  pumlStream: Readable,
  outputStream: Writable,
  options: PlantUmlOptions = {}
): Promise<number> => {
  const pumlJavaOptions = genPumlJavaOptions(options)

  return pipePuml(pumlStream, outputStream, pumlJavaOptions)
}

export const genPumlJavaOptions = (options: PlantUmlOptions = {}): string[] => {
  const plantUmlOptions: string[] = [
    "-jar",
    path.join(__dirname, "./plantuml.jar"),
    "-Djava.awt.headless=true"
  ]
  if (options?.format) {
    if (!outputFormats.includes(options.format)) {
      throw new Error(
        `Invalid format ${options.format}. Must be either: ${JSON.stringify(
          outputFormats
        )}`
      )
    }
    plantUmlOptions.push("-t" + options.format)
  }
  if (options.limitSize) {
    plantUmlOptions.push("-DPLANTUML_LIMIT_SIZE=" + options.limitSize)
  }
  if (options.config) {
    plantUmlOptions.push("-config", options.config)
  }
  if (options.pipemap) {
    plantUmlOptions.push("-pipemap")
  } else {
    plantUmlOptions.push("-pipe")
  }

  return plantUmlOptions
}

const pipePuml = (
  pumlStream: Readable,
  outputStream: Writable,
  plantUmlOptions: string[]
): Promise<number> => {
  return new Promise<number>(async (resolve, reject) => {
    const child = spawn("java", plantUmlOptions)
    pumlStream.pipe(child.stdin)
    child.stdout.pipe(outputStream)

    let error = ""
    for await (const chunk of child.stderr) {
      error += chunk
    }

    child.once("exit", code => {
      if (code === 0) {
        resolve(code)
      } else {
        reject(
          new VError(
            { info: { code } },
            `PlantUML process existed with status code ${code}. ${error}`
          )
        )
      }
    })
    child.once("error", err => {
      reject(new VError(err, `PlantUML process failed with error: ${error}`))
    })
  })
}
